import { createContext, useState, type ReactNode } from 'react'
import type { AuthSession } from '../types/auth'

const STORAGE_KEY = 'sm_session'

export function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

function saveSession(session: AuthSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

interface AuthContextValue {
  session: AuthSession | null
  setAuth: (session: AuthSession) => void
  clearAuth: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(getStoredSession)

  function setAuth(data: AuthSession) {
    saveSession(data)
    setSession(data)
  }

  function clearAuth() {
    clearSession()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

