import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await forgotPassword(email)
      setSuccess('Password reset email sent. Check your inbox and continue from the secure reset link.')
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="We will send a secure reset link to your registered email address."
      footer={
        <p className="text-center text-sm text-[#6B7280]">
          Remembered it? <Link to="/login" className="font-bold text-[#0F766E]">Back to login</Link>
        </p>
      }
    >
      {error ? <Message tone="error">{error}</Message> : null}
      {success ? <Message tone="success">{success}</Message> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-bold text-[#1F2937]">
          Email address
          <div className="relative mt-2">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
            <input
              className="input-field pl-11"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full rounded-2xl py-3 font-bold disabled:opacity-60">
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </AuthShell>
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