import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react'
import AuthShell from '../components/AuthShell.jsx'
import { resetPassword } from '../services/api.js'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = searchParams.get('token') || ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const data = await resetPassword({ token, password })
      setMessage(data.message)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AuthShell title="Reset Password" subtitle="Set a new password using your reset token.">
      {error && <Message status="error">{error}</Message>}
      {message && <Message status="success">{message}</Message>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-bold text-[#1F2937]">
          New Password
          <div className="relative mt-2">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
            <input className="input-field pl-11 pr-11" type={showPass ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create new password" required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </label>
        <label className="block text-sm font-bold text-[#1F2937]">
          Confirm Password
          <div className="relative mt-2">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
            <input className="input-field pl-11 pr-11" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" required />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </label>
        <button className="btn-primary w-full rounded-2xl py-3 font-bold">Reset password</button>
      </form>
      <p className="mt-6 text-center text-sm text-[#6B7280]">
        <Link to="/login" className="font-bold text-[#0F766E]">Back to login</Link>
      </p>
    </AuthShell>
  )
}

function Message({ status, children }) {
  return (
    <div className={`mb-5 rounded-2xl px-4 py-3 text-sm font-semibold ${status === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-rose-200 bg-rose-50 text-rose-600'}`}>
      {children}
    </div>
  )
}
