from datetime import datetime, timedelta, timezone
from pathlib import Path
import os

import bcrypt
import jwt
import psycopg
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field


load_dotenv(Path(__file__).resolve().parents[1] / ".env.local")

app = FastAPI(title="Social Plateform API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserCreate(BaseModel):
    username: str = Field(min_length=2, max_length=50)
    email: str = Field(pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$", max_length=254)
    password: str = Field(min_length=6, max_length=128)
    domain: str = Field(min_length=1, max_length=50)
    role: str = Field(min_length=1, max_length=50)


class UserLogin(BaseModel):
    email: str = Field(pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$", max_length=254)
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    domain: str
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


JWT_ALGORITHM = "HS256"
JWT_EXPIRES_MINUTES = 60 * 24 * 7

bearer_scheme = HTTPBearer()


def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL_UNPOOLED") or os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured")
    return database_url


def get_jwt_secret() -> str:
    secret = os.getenv("JWT_SECRET")
    if not secret:
        raise RuntimeError("JWT_SECRET is not configured")
    return secret


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> UserResponse:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired session. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(credentials.credentials, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError as error:
        raise unauthorized from error

    user_id = payload.get("sub")
    if not user_id:
        raise unauthorized

    with psycopg.connect(get_database_url()) as connection:
        row = connection.execute(
            "SELECT id, username, email, domain, role FROM users WHERE id = %s",
            (user_id,),
        ).fetchone()

    if row is None:
        raise unauthorized

    return UserResponse(id=str(row[0]), username=row[1], email=row[2], domain=row[3], role=row[4])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate) -> UserResponse:
    password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()

    try:
        with psycopg.connect(get_database_url()) as connection:
            row = connection.execute(
                """
                INSERT INTO users (username, email, password_hash, domain, role)
                VALUES (%s, lower(%s), %s, %s, %s)
                RETURNING id, username, email, domain, role
                """,
                (user.username.strip(), user.email, password_hash, user.domain, user.role),
            ).fetchone()
            connection.commit()
    except psycopg.errors.UniqueViolation as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="That username or email is already registered.",
        ) from error

    if row is None:
        raise HTTPException(status_code=500, detail="User could not be created.")

    return UserResponse(
        id=str(row[0]),
        username=row[1],
        email=row[2],
        domain=row[3],
        role=row[4],
    )


@app.post("/api/login", response_model=LoginResponse)
def login(credentials: UserLogin) -> LoginResponse:
    with psycopg.connect(get_database_url()) as connection:
        row = connection.execute(
            """
            SELECT id, username, email, password_hash, domain, role
            FROM users
            WHERE email = lower(%s)
            """,
            (credentials.email,),
        ).fetchone()

    if row is None or not bcrypt.checkpw(credentials.password.encode(), row[3].encode()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    user = UserResponse(id=str(row[0]), username=row[1], email=row[2], domain=row[4], role=row[5])
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRES_MINUTES)
    token = jwt.encode(
        {"sub": user.id, "exp": expires_at},
        get_jwt_secret(),
        algorithm=JWT_ALGORITHM,
    )

    return LoginResponse(access_token=token, user=user)


@app.get("/api/me", response_model=UserResponse)
def read_current_user(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    return current_user