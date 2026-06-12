import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login({ email, password, role: 'admin', remember })
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#0F766E]"><ArrowLeft size={16} /> Back to Home</Link>
        <div className="surface rounded-3xl p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FAF8] text-[#0F766E]"><ShieldCheck size={28} /></div>
            <p className="section-eyebrow">ALAYAA Control</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#1F2937]">Admin Login</h1>
            <p className="mt-2 text-sm text-[#6B7280]">Platform administration access.</p>
          </div>
          {error && <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-sm font-bold text-[#1F2937]">
              Admin Email
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
                <input className="input-field pl-11" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@alayaa.in" required />
              </div>
            </label>
            <label className="block text-sm font-bold text-[#1F2937]">
              Password
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
                <input className="input-field pl-11 pr-11" type={showPass ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-[#6B7280]"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-[#0F766E]" /> Remember me</label>
            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="font-bold text-[#0F766E]">Forgot password?</Link>
              <span className="text-[#6B7280]">Admin</span>
            </div>
            <button className="btn-primary w-full rounded-2xl py-3 font-bold">Admin Sign In</button>
          </form>
        </div>
      </div>
    </div>
  )
}
