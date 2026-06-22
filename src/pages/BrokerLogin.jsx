
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function BrokerLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const message = location.state?.message || ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login({ email, password, role: 'broker' })
      navigate('/broker/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

const perks = ['Free verified property listings', 'Direct buyer enquiry notifications', 'Priority visibility in Tamil Nadu city searches', 'Lead and listing analytics']

export default function BrokerLogin() {
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await login({ email: form.email, password: form.password, role: 'broker', remember })
      navigate('/broker/dashboard')
    } catch (err) {
      setError(err.message)

    }
  }

  return (

    <AuthShell
      title="Broker login"
      subtitle="Manage verified listings, enquiries, and approval status from your broker dashboard."
      footer={
        <div className="space-y-2 text-center text-sm text-[#6B7280]">
          <p>
            Need a broker account? <Link to="/broker/register" className="font-bold text-[#0F766E]">Register here</Link>
          </p>
          <p>
            Customer? <Link to="/login" className="font-bold text-[#0F766E]">Sign in as customer</Link>
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
            placeholder="broker@example.com"
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

    <div className="grid min-h-screen bg-[#FAF9F6] lg:grid-cols-[.9fr_1.1fr]">
      <aside className="hidden bg-[#134E4A] p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <Link to="/" className="mb-14 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-[#134E4A]">A</div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Broker Network</div>
            <div className="text-2xl font-extrabold">ALAYAA</div>
          </div>
        </Link>
        <h1 className="text-5xl font-extrabold leading-tight">Grow your Tamil Nadu property business.</h1>
        <p className="mt-5 max-w-md text-white/70">List verified homes, manage leads, and reach qualified buyers across Chennai, Coimbatore, Madurai, Hosur, and more.</p>
        <ul className="mt-8 space-y-4">
          {perks.map((perk) => <li key={perk} className="flex items-center gap-3 text-white/80"><CheckCircle2 size={18} /> {perk}</li>)}
        </ul>
      </aside>

      <main className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#0F766E]"><ArrowLeft size={16} /> Back to Home</Link>
          <div className="surface rounded-3xl p-8">
            <h1 className="text-3xl font-extrabold text-[#1F2937]">Broker Login</h1>
            <p className="mb-6 mt-2 text-sm text-[#6B7280]">Access your broker dashboard, listings, and lead management.</p>
            {error && <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} placeholder="broker@alayaa.in" />
              <Password value={form.password} onChange={(value) => update('password', value)} show={showPass} setShow={setShowPass} />
              <label className="flex items-center gap-2 text-sm font-medium text-[#6B7280]"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-[#0F766E]" /> Remember me</label>
              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="font-bold text-[#0F766E]">Forgot password?</Link>
                <Link to="/broker/register" className="font-bold text-[#0F766E]">Create broker account</Link>
              </div>
              <button className="btn-primary w-full rounded-2xl py-3 font-bold">Sign In</button>
            </form>
            <p className="mt-6 text-center text-sm text-[#6B7280]">Customer? <Link to="/login" className="font-bold text-[#0F766E]">Sign in here</Link></p>

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
    </AuthShell>
  )
}


function Field({ label, icon: Icon, children }) {

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder }) {

  return (
    <label className="block text-sm font-bold text-[#1F2937]">
      {label}
      <div className="relative mt-2">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />

        <div className="pl-11">{children}</div>

        <input className="input-field pl-11" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required />

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

