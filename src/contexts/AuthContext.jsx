
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  forgotPassword as apiForgotPassword,
  getSessionUser,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  resetPassword as apiResetPassword,
  sendEmailEvent,
  updateProfile as apiUpdateProfile,
  uploadProfilePicture as apiUploadProfilePicture,
} from '../services/Api.jsx'
import { supabase } from '../services/supabaseClient.js'


const AuthContext = createContext(null)

function applyUserProfile(authUser, profile) {
  if (!authUser) return null
  return {
    id: authUser.id,
    email: authUser.email || profile?.email || '',
    profile: profile || {
      id: authUser.id,
      full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
      email: authUser.email || '',
      phone: authUser.user_metadata?.phone || '',
      role: authUser.user_metadata?.role || 'customer',
      profile_picture: authUser.user_metadata?.profile_picture || '',
      city: authUser.user_metadata?.city || '',
      bio: authUser.user_metadata?.bio || '',
      brokerApproval: null,
    },
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bootstrapped, setBootstrapped] = useState(false)

  async function hydrate(nextSessionUser) {
    if (!nextSessionUser) {
      setUser(null)
      setLoading(false)
      return null
    }

    try {
      const currentUser = await getSessionUser()
      const resolved = currentUser || applyUserProfile(nextSessionUser, null)
      setUser(resolved)
      setLoading(false)
      return resolved
    } catch (error) {
      console.error('Failed to hydrate session user', error)
      const fallback = applyUserProfile(nextSessionUser, null)
      setUser(fallback)
      setLoading(false)
      return fallback
    }
  }

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!active) return
        setSession(data.session || null)
        if (data.session?.user) {
          await hydrate(data.session.user)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Session bootstrap failed', error)
        if (active) setLoading(false)
      } finally {
        if (active) setBootstrapped(true)
      }
    }

    bootstrap()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return
      setSession(nextSession || null)
      if (nextSession?.user) {
        setLoading(true)
        await hydrate(nextSession.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  async function login(payload) {
    const result = await apiLogin(payload)
    setSession(result.session || null)
    setUser(result.user || null)
    return result
  }

  async function register(payload) {
    const result = await apiRegister(payload)
    return result
  }

  async function logout() {
    await apiLogout()
    setSession(null)
    setUser(null)
  }

  async function forgotPassword(email) {
    return apiForgotPassword(email)
  }

  async function resetPassword(password) {
    return apiResetPassword(password)
  }

  async function updateProfile(updates) {
    if (!user?.id) throw new Error('You must be signed in to update your profile.')
    const updated = await apiUpdateProfile(user.id, updates)
    setUser((current) => current ? { ...current, profile: updated } : current)
    return updated
  }

  async function uploadProfilePicture(file) {
    if (!user?.id) throw new Error('You must be signed in to upload a profile picture.')
    const publicUrl = await apiUploadProfilePicture(file, user.id)
    const updated = await updateProfile({ profile_picture: publicUrl })
    return updated
  }

  async function refreshUser() {
    const fresh = await getSessionUser()
    setUser(fresh)
    return fresh
  }

  const value = useMemo(() => ({
    session,
    user,
    loading: loading || !bootstrapped,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    uploadProfilePicture,
    refreshUser,
    sendEmailEvent,
  }), [session, user, loading, bootstrapped])

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

    throw new Error('useAuth must be used within AuthProvider')

    throw new Error('useAuth must be used within an AuthProvider')

  }
  return context
}
