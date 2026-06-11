import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'

const perks = ['Free verified property listings', 'Direct buyer enquiry notifications', 'Priority visibility in Tamil Nadu city searches', 'Lead and listing analytics']

export default function BrokerLogin() {
  const [mode, setMode] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', rera: '' })
  const navigate = useNavigate()

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const handleLogin = (event) => {
    event.preventDefault()
    if (form.email === 'broker@alayaa.in' && form.password === 'broker123') navigate('/dashboard')
    else setError('Demo: broker@alayaa.in / broker123')
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
            <div className="mb-6 grid grid-cols-2 rounded-2xl bg-[#F8F8F7] p-1">
              <button onClick={() => setMode('login')} className={`rounded-xl py-2 text-sm font-bold ${mode === 'login' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-[#6B7280]'}`}>Broker Login</button>
              <button onClick={() => setMode('register')} className={`rounded-xl py-2 text-sm font-bold ${mode === 'register' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-[#6B7280]'}`}>Register</button>
            </div>
            <h1 className="text-3xl font-extrabold text-[#1F2937]">{mode === 'login' ? 'Broker / Agent Login' : 'Create Broker Account'}</h1>
            <p className="mb-6 mt-2 text-sm text-[#6B7280]">{mode === 'login' ? 'Access listings, leads, and dashboard insights.' : 'Start listing premium Tamil Nadu properties.'}</p>
            {error && <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</div>}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} placeholder="broker@alayaa.in" />
                <Password value={form.password} onChange={(value) => update('password', value)} show={showPass} setShow={setShowPass} />
                <button className="btn-primary w-full rounded-2xl py-3 font-bold">Sign In</button>
              </form>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); navigate('/dashboard') }} className="space-y-3">
                <Field icon={User} label="Full Name" value={form.name} onChange={(value) => update('name', value)} placeholder="Your name" />
                <Field icon={Phone} label="Mobile Number" type="tel" value={form.phone} onChange={(value) => update('phone', value)} placeholder="+91 98765 43210" />
                <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} placeholder="broker@email.com" />
                <Field icon={Building2} label="RERA Number" value={form.rera} onChange={(value) => update('rera', value)} placeholder="Optional" required={false} />
                <Password value={form.password} onChange={(value) => update('password', value)} show={showPass} setShow={setShowPass} />
                <button className="btn-primary w-full rounded-2xl py-3 font-bold">Create Account</button>
              </form>
            )}
            <p className="mt-6 text-center text-sm text-[#6B7280]">Customer? <Link to="/login" className="font-bold text-[#0F766E]">Sign in here</Link></p>
          </div>
        </div>
      </main>
    </div>
  )
}

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder, required = true }) {
  return (
    <label className="block text-sm font-bold text-[#1F2937]">
      {label}
      <div className="relative mt-2">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
        <input className="input-field pl-11" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} />
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
