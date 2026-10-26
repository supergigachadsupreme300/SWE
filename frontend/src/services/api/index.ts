export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function authHeaders(extra?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('brewlite_token')
    if (token) headers.Authorization = `Bearer ${token}`
  }
  return { ...headers, ...(extra || {}) }
}

export async function apiGet<T = any>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('brewlite_token') : null
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.message || `API GET error (${res.status})`)
  }
  return res.json()
}

export async function apiPost<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(options?.headers),
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.message || `API POST error (${res.status})`)
  }
  return res.json()
}

export async function apiPatch<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: authHeaders(options?.headers),
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.message || `API PATCH error (${res.status})`)
  }
  return res.json()
}
