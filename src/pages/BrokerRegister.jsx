import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function BrokerRegister() {
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
        role: 'broker',
      })
      navigate('/broker/login', {
        replace: true,
        state: {
          message: 'Registration submitted. Verify your email and wait for broker approval.',
        },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Broker Registration"
      subtitle="Create your broker account. Approved brokers can publish and manage listings."
      footer={
        <p className="text-center text-sm text-[#6B7280]">
          Already have an account?{' '}
          <Link to="/broker/login" className="font-bold text-[#0F766E]">
            Sign in
          </Link>
        </p>
      }
    >
      {error ? <Notice tone="error">{error}</Notice> : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" icon={User}>
          <input
            className="input-field"
            value={form.fullName}
            onChange={(e) => setForm((c) => ({ ...c, fullName: e.target.value }))}
            placeholder="Full name"
            required
          />
        </Field>

        <Field label="Email address" icon={Mail}>
          <input
            className="input-field"
            type="email"
            value={form.email}
            onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
            placeholder="broker@example.com"
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone number" icon={Phone}>
            <input
              className="input-field"
              value={form.phone}
              onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
              placeholder="+91 98765 43210"
              required
            />
          </Field>

          <Field label="City" icon={MapPin}>
            <input
              className="input-field"
              value={form.city}
              onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))}
              placeholder="Chennai"
              required
            />
          </Field>
        </div>

        <Field label="Bio">
          <textarea
            className="input-field min-h-24 resize-none"
            value={form.bio}
            onChange={(e) => setForm((c) => ({ ...c, bio: e.target.value }))}
            placeholder="Tell customers about your experience and locations served..."
          />
        </Field>

        <Field label="Password" icon={Lock}>
          <div className="relative">
            <input
              className="input-field pr-11"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
              placeholder="Create password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((c) => !c)}
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
            onChange={(e) => setForm((c) => ({ ...c, confirm: e.target.value }))}
            placeholder="Confirm password"
            required
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full rounded-2xl py-3 font-bold disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit registration'}
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
        {Icon ? (
          <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
        ) : null}
        <div className={Icon ? 'pl-11' : ''}>{children}</div>
      </div>
    </label>
  )
}

function Notice({ tone, children }) {
  return (
    <div
      className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
        tone === 'success'
          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border border-rose-200 bg-rose-50 text-rose-600'
      }`}
    >
      {children}
    </div>
  )
}