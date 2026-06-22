import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

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
