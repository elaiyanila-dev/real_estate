import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function CustomerLogin() {
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

function Field({ icon: Icon, label, type, value, onChange, placeholder }) {
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
        <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
      </div>
    </label>
  )
}

function Message({ text }) {
  return <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{text}</div>
}

