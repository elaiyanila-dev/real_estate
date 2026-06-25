const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }
  return data
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const login = async (payload) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const register = async (payload) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email }),
  })
  return handleResponse(response)
}

export const resetPassword = async (payload) => {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const fetchProfile = async (token) => {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    headers: authHeaders(token),
  })
  return handleResponse(response)
}

export const fetchBrokerListings = async (token) => {
  const response = await fetch(`${API_URL}/api/broker/listings`, {
    method: 'GET',
    headers: authHeaders(token),
  })
  return handleResponse(response)
}

export const fetchAdminStats = async (token) => {
  const response = await fetch(`${API_URL}/api/admin/stats`, {
    method: 'GET',
    headers: authHeaders(token),
  })
  return handleResponse(response)
}

export const fetchUserFavorites = async (token) => {
  const response = await fetch(`${API_URL}/api/user/favorites`, {
    method: 'GET',
    headers: authHeaders(token),
  })
  return handleResponse(response)
}

export const fetchProperties = async (query = '') => {
  const url = `${API_URL}/api/properties${query ? '?query=' + encodeURIComponent(query) : ''}`
  const response = await fetch(url, {
    method: 'GET',
    headers: authHeaders(),
  })
  return handleResponse(response)
}
