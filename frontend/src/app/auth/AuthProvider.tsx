import { createContext, useContext, useEffect, useState } from 'react'
import { fetchCurrentUser, login as loginRequest, register as registerRequest } from '../lib/api'
import type { AuthUser } from '../lib/types'

interface AuthContextValue {
  isReady: boolean
  isAuthenticated: boolean
  token: string | null
  user: AuthUser | null
  login: (payload: { email: string; password: string }) => Promise<void>
  register: (payload: { name: string; email: string; password: string; role?: 'ARTIST' | 'USER'; bio?: string }) => Promise<void>
  logout: () => void
}

const AUTH_STORAGE_KEY = 'chromag-auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredAuth() {
  const storedValue = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!storedValue) {
    return { token: null, user: null }
  }

  try {
    return JSON.parse(storedValue) as { token: string | null; user: AuthUser | null }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ token, user }, setAuth] = useState(() => readStoredAuth())
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!token) {
      setIsReady(true)
      return
    }

    fetchCurrentUser(token)
      .then((response) => {
        const nextState = { token, user: response.user }
        setAuth(nextState)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState))
      })
      .catch(() => {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        setAuth({ token: null, user: null })
      })
      .finally(() => {
        setIsReady(true)
      })
  }, [token])

  useEffect(() => {
    function handleUnauthorized() {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      setAuth({ token: null, user: null })
    }

    window.addEventListener('chromag:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('chromag:unauthorized', handleUnauthorized)
    }
  }, [])

  async function login(payload: { email: string; password: string }) {
    const response = await loginRequest(payload)
    const nextState = { token: response.token, user: response.user }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState))
    setAuth(nextState)
  }

  async function register(payload: { name: string; email: string; password: string; role?: 'ARTIST' | 'USER'; bio?: string }) {
    const response = await registerRequest(payload)
    const nextState = { token: response.token, user: response.user }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState))
    setAuth(nextState)
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuth({ token: null, user: null })
  }

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isAuthenticated: Boolean(token && user),
        token,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return context
}
