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

function Message({ status, children }) {
  return (
    <div className={`mb-5 rounded-2xl px-4 py-3 text-sm font-semibold ${status === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-rose-200 bg-rose-50 text-rose-600'}`}>

      {children}
    </div>
  )
}

