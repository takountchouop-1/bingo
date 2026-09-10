const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export type CreateUserInput = {
	username: string
	email: string
	password: string
	domain: string
	role: string
}

export async function createUser(input: CreateUserInput) {
	const response = await fetch(`${API_BASE_URL}/api/users`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	})

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as { detail?: string } | null
		throw new Error(body?.detail ?? 'Unable to create your account.')
	}

	return response.json() as Promise<{
		id: string
		username: string
		email: string
		domain: string
		role: string
	}>
}

export type LoginInput = {
	email: string
	password: string
}

export type AuthUser = {
	id: string
	username: string
	email: string
	domain: string
	role: string
}

export type LoginResult = {
	access_token: string
	token_type: string
	user: AuthUser
}

export async function getCurrentUser(token: string) {
	const response = await fetch(`${API_BASE_URL}/api/me`, {
		headers: { Authorization: `Bearer ${token}` },
	})

	if (!response.ok) {
		throw new Error('Session expired. Please log in again.')
	}

	return response.json() as Promise<AuthUser>
}

export async function loginUser(input: LoginInput) {
	const response = await fetch(`${API_BASE_URL}/api/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input),
	})

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as { detail?: string } | null
		throw new Error(body?.detail ?? 'Unable to log you in.')
	}

	return response.json() as Promise<LoginResult>
}
