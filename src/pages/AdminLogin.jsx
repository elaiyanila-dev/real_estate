import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'


export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login({ email, password, role: 'admin' })
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)

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

    <AuthShell
      title="Admin login"
      subtitle="Platform access for ALAYAA operators and moderators only."
      footer={
        <p className="text-center text-sm text-[#6B7280]">
          Return to <Link to="/" className="font-bold text-[#0F766E]">home</Link>
        </p>
      }
    >
      {error ? <Notice tone="error">{error}</Notice> : null}
      <div className="mb-6 flex items-center gap-3 rounded-3xl bg-[#F8F8F7] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FAF8] text-[#0F766E]">
          <ShieldCheck size={22} />
        </div>
        <div>
          <div className="font-extrabold text-[#1F2937]">Restricted access</div>
          <div className="text-sm text-[#6B7280]">Only pre-provisioned admin accounts can sign in here.</div>

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email address" icon={Mail}>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example.com"
            required
          />
        </Field>
        <Field label="Password" icon={Lock}>
          <div className="relative">
            <input
              className="input-field pr-11"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        <button type="submit" disabled={loading} className="btn-primary w-full rounded-2xl py-3 font-bold disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block text-sm font-bold text-[#1F2937]">
      {label}
      <div className="relative mt-2">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
        <div className="pl-11">{children}</div>
      </div>
    </label>
  )
}

function Notice({ tone, children }) {
  return (
    <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
      tone === 'success'
        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border border-rose-200 bg-rose-50 text-rose-600'
    }`}>
      {children}
    </div>
  )
}
