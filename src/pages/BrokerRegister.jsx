import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function BrokerRegister() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', company: '', bio: '' })
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
    setSuccess('')
    try {
      await register({ ...form, role: 'broker', remember })
      setSuccess('Broker registration submitted. Await approval to sign in.')
      navigate('/broker/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AuthShell title="Broker Registration" subtitle="Create your broker account and get verified by ALAYAA.">
      {error && <Message status="error">{error}</Message>}
      {success && <Message status="success">{success}</Message>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field icon={User} label="Full Name" value={form.fullName} onChange={(value) => update('fullName', value)} placeholder="Priya Nair" />
        <Field icon={Mail} label="Email Address" type="email" value={form.email} onChange={(value) => update('email', value)} placeholder="broker@alayaa.in" />
        <Field icon={Phone} label="Phone Number" type="tel" value={form.phone} onChange={(value) => update('phone', value)} placeholder="+91 91234 56789" />
        <Field icon={Building2} label="Company" value={form.company} onChange={(value) => update('company', value)} placeholder="ALAYAA Realty" />
        <Field icon={User} label="Profile Bio" value={form.bio} onChange={(value) => update('bio', value)} placeholder="Expert in premium Tamil Nadu real estate" />
        <PasswordField value={form.password} onChange={(value) => update('password', value)} show={showPass} setShow={setShowPass} />
        <label className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280]">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-[#0F766E]" />
          Remember me on this device
        </label>
        <button type="submit" className="btn-primary w-full rounded-2xl py-3 font-bold">Submit Registration</button>
      </form>
      <p className="mt-6 text-center text-sm text-[#6B7280]">Already registered? <Link to="/broker/login" className="font-bold text-[#0F766E]">Broker Sign in</Link></p>
    </AuthShell>
  )
}

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder }) {
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
        <input className="input-field pl-11 pr-11" type={show ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Create password" required />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
      </div>
    </label>
  )
}

function Message({ status, children }) {
  return (
    <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${status === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-rose-200 bg-rose-50 text-rose-600'}`}>
      {children}
    </div>
  )
}
