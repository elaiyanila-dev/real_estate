
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react'

import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function CustomerLogin() {

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const message = location.state?.message || (location.search.includes('verified=1') ? 'Email verified successfully. Sign in to continue.' : '')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login({ email, password, role: 'customer' })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)

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
      await login({ email, password, role: 'user', remember })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)

    }
  }

  return (

    <AuthShell
      title="Customer login"
      subtitle="Sign in to save homes, send enquiries, and manage your profile."
      footer={
        <div className="space-y-2 text-center text-sm text-[#6B7280]">
          <p>
            New here? <Link to="/register" className="font-bold text-[#0F766E]">Create a customer account</Link>
          </p>
          <p>
            Broker? <Link to="/broker/login" className="font-bold text-[#0F766E]">Sign in as a broker</Link>
          </p>
        </div>
      }
    >
      {message ? <Notice tone="success">{message}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email address" icon={Mail}>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
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
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[#6B7280]">
            <input type="checkbox" className="accent-[#0F766E]" />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-bold text-[#0F766E]">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full rounded-2xl py-3 font-bold disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

    <AuthShell title="Customer Sign In" subtitle="Access saved homes, wishlist, and recommendations.">
      {error && <Message text={error} />}
      <form onSubmit={handleLogin} className="space-y-4">
        <Field icon={Mail} label="Email Address" type="email" value={email} onChange={setEmail} placeholder="user@alayaa.in" />
        <PasswordField value={password} onChange={setPassword} show={showPass} setShow={setShowPass} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[#6B7280]"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-[#0F766E]" /> Remember me</label>
          <Link to="/forgot-password" className="font-bold text-[#0F766E]">Forgot password?</Link>
        </div>
        <button className="btn-primary w-full rounded-2xl py-3 font-bold">Sign In</button>
      </form>
      <p className="mt-6 text-center text-sm text-[#6B7280]">New to ALAYAA? <Link to="/register" className="font-bold text-[#0F766E]">Create an account</Link></p>
      <p className="mt-3 text-center text-sm text-[#6B7280]">Are you a broker? <Link to="/broker/login" className="font-bold text-[#0F766E]">Broker Login</Link></p>

    </AuthShell>
  )
}


function Field({ label, icon: Icon, children }) {

function Field({ icon: Icon, label, type, value, onChange, placeholder }) {

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

    <label className="block text-sm font-bold text-[#1F2937]">
      Password
      <div className="relative mt-2">
        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
        <input className="input-field pl-11 pr-11" type={show ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Enter password" required />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
      </div>
    </label>

  )
}

function Message({ text }) {
  return <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{text}</div>
}

