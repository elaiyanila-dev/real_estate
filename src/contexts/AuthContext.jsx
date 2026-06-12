import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '../services/api.js'

const AuthContext = createContext(null)
const STORAGE_TOKEN = 'alayaa_auth_token'
const STORAGE_USER = 'alayaa_auth_user'
const STORAGE_REMEMBER = 'alayaa_auth_remember'

const chooseStorage = (remember) => (remember ? localStorage : sessionStorage)

const persistAuth = ({ token, user, remember }) => {
  const storage = chooseStorage(remember)
  storage.setItem(STORAGE_TOKEN, token)
  storage.setItem(STORAGE_USER, JSON.stringify(user))
  if (remember) {
    localStorage.setItem(STORAGE_REMEMBER, 'true')
  } else {
    localStorage.removeItem(STORAGE_REMEMBER)
  }
}

const clearAuth = () => {
  localStorage.removeItem(STORAGE_TOKEN)
  localStorage.removeItem(STORAGE_USER)
  localStorage.removeItem(STORAGE_REMEMBER)
  sessionStorage.removeItem(STORAGE_TOKEN)
  sessionStorage.removeItem(STORAGE_USER)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const remember = localStorage.getItem(STORAGE_REMEMBER) === 'true'
    const storage = chooseStorage(remember)
    const savedToken = storage.getItem(STORAGE_TOKEN)
    const savedUser = storage.getItem(STORAGE_USER)

    if (savedToken) {
      setToken(savedToken)
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch {
          setUser(null)
        }
      }
      api.fetchProfile(savedToken).then((profile) => {
        setUser(profile)
      }).catch(() => {
        clearAuth()
        setUser(null)
        setToken(null)
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async ({ email, password, role, remember = false }) => {
    setError(null)
    const payload = { email: email.trim().toLowerCase(), password, role }
    const data = await api.login(payload)
    setToken(data.token)
    setUser(data.user)
    persistAuth({ token: data.token, user: data.user, remember })
    return data.user
  }

  const register = async ({ fullName, email, phone, password, role, profilePicture, company, bio, remember = false }) => {
    setError(null)
    const payload = {
      fullName,
      email: email.trim().toLowerCase(),
      phone,
      password,
      role,
      profilePicture,
      company,
      bio,
    }
    const data = await api.register(payload)
    setToken(data.token)
    setUser(data.user)
    persistAuth({ token: data.token, user: data.user, remember })
    return data.user
  }

  const logout = () => {
    clearAuth()
    setUser(null)
    setToken(null)
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    setError,
  }), [user, token, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
