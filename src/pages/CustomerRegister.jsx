import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function CustomerRegister() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
    password: '',
    confirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import * as api from '../services/api.js'
import AuthShell from '../components/AuthShell.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function CustomerRegister() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const { register } = useAuth()

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))


  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')


    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        bio: form.bio,
        password: form.password,
        role: 'customer',
      })
      navigate('/login', {
        replace: true,
        state: {
          message: 'Registration successful. Please verify your email before signing in.',
        },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)

    setSuccess('')

    try {
      await register({ ...form, role: 'user', remember })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)

    }
  }

  return (

    <AuthShell
      title="Customer registration"
      subtitle="Create your ALAYAA account to save properties and send enquiries."
      footer={
        <p className="text-center text-sm text-[#6B7280]">
          Already registered? <Link to="/login" className="font-bold text-[#0F766E]">Sign in</Link>
        </p>
      }
    >
      {error ? <Notice tone="error">{error}</Notice> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" icon={User}>
          <input
            className="input-field"
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            placeholder="Full name"
            required
          />
        </Field>
        <Field label="Email address" icon={Mail}>
          <input
            className="input-field"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@example.com"
            required
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone number" icon={Phone}>
            <input
              className="input-field"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="+91 98765 43210"
              required
            />
          </Field>
          <Field label="City" icon={MapPin}>
            <input
              className="input-field"
              value={form.city}
              onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
              placeholder="Chennai"
              required
            />
          </Field>
        </div>
        <Field label="Bio">
          <textarea
            className="input-field min-h-24 resize-none"
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
            placeholder="Tell brokers what you are looking for..."
          />
        </Field>
        <Field label="Password" icon={Lock}>
          <div className="relative">
            <input
              className="input-field pr-11"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Create password"
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
        <Field label="Confirm password" icon={Lock}>
          <input
            className="input-field"
            type="password"
            value={form.confirm}
            onChange={(event) => setForm((current) => ({ ...current, confirm: event.target.value }))}
            placeholder="Confirm password"
            required
          />
        </Field>
        <button type="submit" disabled={loading} className="btn-primary w-full rounded-2xl py-3 font-bold disabled:opacity-60">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

    <AuthShell title="Create your ALAYAA account" subtitle="Register as a property seeker and save favorites, inquiries, and more.">
      {error && <Message status="error">{error}</Message>}
      {success && <Message status="success">{success}</Message>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field icon={User} label="Full Name" value={form.fullName} onChange={(value) => update('fullName', value)} placeholder="Rahul Kumar" />
        <Field icon={Mail} label="Email Address" type="email" value={form.email} onChange={(value) => update('email', value)} placeholder="user@alayaa.in" />
        <Field icon={Phone} label="Phone Number" type="tel" value={form.phone} onChange={(value) => update('phone', value)} placeholder="+91 98765 43210" />
        <PasswordField value={form.password} onChange={(value) => update('password', value)} show={showPass} setShow={setShowPass} />
        <label className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280]">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-[#0F766E]" />
          Remember me on this device
        </label>
        <button type="submit" className="btn-primary w-full rounded-2xl py-3 font-bold">Create Account</button>
      </form>
      <p className="mt-6 text-center text-sm text-[#6B7280]">
        Already have an account? <Link to="/login" className="font-bold text-[#0F766E]">Sign in</Link>
      </p>

    </AuthShell>
  )
}


function Field({ label, icon: Icon, children }) {

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder }) {

  return (
    <label className="block text-sm font-bold text-[#1F2937]">
      {label}
      <div className="relative mt-2">

        {Icon ? <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" /> : null}
        <div className={Icon ? 'pl-11' : ''}>{children}</div>

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
        <input className="input-field pl-11 pr-11" type={show ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Create password" required />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>

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

function Message({ status, children }) {
  return (
    <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${status === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-rose-200 bg-rose-50 text-rose-600'}`}>

      {children}
    </div>
  )
}
