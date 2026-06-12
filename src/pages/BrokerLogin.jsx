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
        </div>
      </main>
    </div>
  )
}

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block text-sm font-bold text-[#1F2937]">
      {label}
      <div className="relative mt-2">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
        <input className="input-field pl-11" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required />
      </div>
    </label>
  )
}

function Password({ value, onChange, show, setShow }) {
  return (
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

