'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại')
      localStorage.setItem('brewlite_token', data.accessToken)
      if (data.user?.id) localStorage.setItem('brewlite_user_id', data.user.id)
      router.push('/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đăng ký')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Đăng ký</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border px-3 py-2"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Đã có tài khoản?{' '}
        <a href="/auth/login" className="text-amber-700 underline">
          Đăng nhập
        </a>
      </p>
    </main>
  )
}