CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text NOT NULL CHECK (char_length(username) BETWEEN 2 AND 50),
    email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
    password_hash text NOT NULL,
    domain text NOT NULL CHECK (char_length(domain) BETWEEN 1 AND 50),
    role text NOT NULL CHECK (char_length(role) BETWEEN 1 AND 50),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON users (lower(username));
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));