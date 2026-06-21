import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(password)
      setSuccess('Your password has been updated successfully.')
      window.setTimeout(() => navigate('/login', { replace: true, state: { message: 'Password updated successfully.' } }), 700)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password for your ALAYAA account."
      footer={
        <p className="text-center text-sm text-[#6B7280]">
          Need help? <Link to="/forgot-password" className="font-bold text-[#0F766E]">Request a new reset link</Link>
        </p>
      }
    >
      {error ? <Message tone="error">{error}</Message> : null}
      {success ? <Message tone="success">{success}</Message> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField label="New password" value={password} onChange={setPassword} />
        <PasswordField label="Confirm password" value={confirm} onChange={setConfirm} />
        <button type="submit" disabled={loading} className="btn-primary w-full rounded-2xl py-3 font-bold disabled:opacity-60">
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  )
}

function PasswordField({ label, value, onChange }) {
  return (
    <label className="block text-sm font-bold text-[#1F2937]">
      {label}
      <div className="relative mt-2">
        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
        <input
          className="input-field pl-11"
          type="password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter password"
          required
        />
      </div>
    </label>
  )
}

function Message({ tone, children }) {
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

