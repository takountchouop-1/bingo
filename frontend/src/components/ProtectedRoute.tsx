import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentUser } from '../services/api'
import { useAuthStore } from '../stores/authstore'

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const [status, setStatus] = useState<'checking' | 'valid' | 'invalid'>('checking')

  useEffect(() => {
    if (!token) return

    let cancelled = false
    getCurrentUser(token)
      .then(() => {
        if (!cancelled) setStatus('valid')
      })
      .catch(() => {
        if (!cancelled) {
          logout()
          setStatus('invalid')
        }
      })

    return () => {
      cancelled = true
    }
  }, [token, logout])

  if (!token || status === 'invalid') return <Navigate to="/signin" replace />
  if (status === 'checking') return null

  return <Outlet />
}

export default ProtectedRoute
