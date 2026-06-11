import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react'

export default function CustomerLogin() {
  const [tab, setTab] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (event) => {
    event.preventDefault()
    if (email === 'user@alayaa.in' && password === 'user123') navigate('/dashboard')
    else setError('Demo: user@alayaa.in / user123')
  }

  return (
    <AuthShell backLabel="Back to Home" title="Customer Sign In" subtitle="Access saved homes, wishlist, and recommendations.">
      <div className="mb-5 grid grid-cols-2 rounded-2xl bg-[#F8F8F7] p-1">
        <button onClick={() => setTab('email')} className={`rounded-xl py-2 text-sm font-bold ${tab === 'email' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-[#6B7280]'}`}>Email</button>
        <button onClick={() => setTab('phone')} className={`rounded-xl py-2 text-sm font-bold ${tab === 'phone' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-[#6B7280]'}`}>Phone OTP</button>
      </div>
      {error && <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</div>}
      {tab === 'email' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <Field icon={Mail} label="Email Address" type="email" value={email} onChange={setEmail} placeholder="user@alayaa.in" />
          <PasswordField value={password} onChange={setPassword} show={showPass} setShow={setShowPass} />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#6B7280]"><input type="checkbox" className="accent-[#0F766E]" /> Remember me</label>
            <a href="#" className="font-bold text-[#0F766E]">Forgot password?</a>
          </div>
          <button className="btn-primary w-full rounded-2xl py-3 font-bold">Sign In</button>
        </form>
      ) : (
        <div className="space-y-4">
          <Field icon={Phone} label="Mobile Number" type="tel" placeholder="+91 98765 43210" />
          <button className="btn-primary w-full rounded-2xl py-3 font-bold">Send OTP</button>
        </div>
      )}
      <p className="mt-6 text-center text-sm text-[#6B7280]">Are you a broker? <Link to="/broker/login" className="font-bold text-[#0F766E]">Broker Login</Link></p>
    </AuthShell>
  )
}

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#0F766E]"><ArrowLeft size={16} /> Back to Home</Link>
        <div className="surface rounded-3xl p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F766E] text-xl font-extrabold text-white">A</div>
            <p className="section-eyebrow">ALAYAA</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#1F2937]">{title}</h1>
            <p className="mt-2 text-sm text-[#6B7280]">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, type, value, onChange = () => {}, placeholder }) {
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

function PasswordField({ value, onChange, show, setShow }) {
  return (
    <label className="block text-sm font-bold text-[#1F2937]">
      Password
      <div className="relative mt-2">
        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
        <input className="input-field pl-11 pr-11" type={show ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Enter password" required />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  )
}
