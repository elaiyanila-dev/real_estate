import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {

  Heart,
  Home,
  LogOut,
  MapPin,
  Search,
  Sparkles,
  User,
  Eye,
  Building2,
  MessageSquare,
  Filter,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import ProfileEditor from '../components/ProfileEditor.jsx'
import {
  fetchCustomerEnquiries,
  fetchFavorites,
  fetchProperties,
  toggleFavorite,
} from '../services/api.jsx'

  Bell, Eye, Heart, Home, LogOut, MapPin, Sparkles, User,
  Camera, Lock, Trash2, CheckCircle, AlertCircle, ChevronRight,
  Phone, Mail, Shield, Bell as BellIcon, Download, X
} from 'lucide-react'
import { properties } from '../data/properties.js'


function formatPrice(value) {
  if (!value) return 'On request'
  if (typeof value === 'string') return value  // already formatted text
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value))
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  if (!message) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl text-sm font-bold transition-all
      ${type === 'success' ? 'bg-[#0F766E] text-white' : 'bg-red-500 text-white'}`}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  )
}

// ─── Avatar Upload ────────────────────────────────────────────────────────────
function AvatarUpload({ initials, avatarUrl, onChange }) {
  return (
    <div className="relative inline-block">
      <div className="h-24 w-24 rounded-full bg-[#F0FAF8] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
        {avatarUrl
          ? <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
          : <span className="text-3xl font-extrabold text-[#0F766E]">{initials}</span>}
      </div>
      <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#0F766E] text-white shadow-md hover:bg-[#134E4A] transition-colors">
        <Camera size={14} />
        <input type="file" accept="image/*" className="sr-only" onChange={e => {
          const file = e.target.files[0]
          if (file) onChange(URL.createObjectURL(file))
        }} />
      </label>
    </div>
  )
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ showToast }) {
  const [activeSection, setActiveSection] = useState('personal')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [saving, setSaving] = useState(false)

  // Personal Info
  const [personal, setPersonal] = useState({
    fullName: 'Rahul Kumar',
    email: 'rahul@alayaa.in',
    phone: '+91 98765 43210',
    city: 'Chennai',
    bio: '',
  })
  const [personalErrors, setPersonalErrors] = useState({})

  // Password
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})

  // Notifications
  const [notifications, setNotifications] = useState({
    newListings: true,
    priceDrops: true,
    inquiryUpdates: true,
    brokerMessages: false,
    weeklyDigest: true,
    smsAlerts: false,
  })

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState('')

  function validatePersonal() {
    const errs = {}
    if (!personal.fullName.trim()) errs.fullName = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) errs.email = 'Enter a valid email'
    if (personal.phone && !/^\+?\d[\d\s-]{7,}$/.test(personal.phone)) errs.phone = 'Enter a valid phone number'
    return errs
  }

  function validatePasswords() {
    const errs = {}
    if (!passwords.current) errs.current = 'Current password is required'
    if (passwords.next.length < 8) errs.next = 'Password must be at least 8 characters'
    if (passwords.next !== passwords.confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  async function handlePersonalSave(e) {
    e.preventDefault()
    const errs = validatePersonal()
    if (Object.keys(errs).length) { setPersonalErrors(errs); return }
    setPersonalErrors({})
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    showToast('Profile updated successfully', 'success')
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    const errs = validatePasswords()
    if (Object.keys(errs).length) { setPwErrors(errs); return }
    setPwErrors({})
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setPasswords({ current: '', next: '', confirm: '' })
    showToast('Password changed successfully', 'success')
  }

  async function handleNotificationsSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    showToast('Notification preferences saved', 'success')
  }

  function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return
    showToast('Account deletion requested. You will receive an email.', 'success')
    setDeleteConfirm('')
  }

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Password & Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ]

  const initials = personal.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Left sidebar navigation */}
      <div className="lg:w-56 shrink-0">
        <div className="surface rounded-3xl p-2">
          {/* Avatar summary */}
          <div className="flex flex-col items-center gap-2 px-4 py-5 border-b border-[#E5E7EB] mb-2">
            <AvatarUpload initials={initials} avatarUrl={avatarUrl} onChange={setAvatarUrl} />
            <div className="text-center mt-1">
              <div className="font-extrabold text-[#1F2937] text-sm">{personal.fullName}</div>
              <div className="text-xs text-[#6B7280] mt-0.5">{personal.city || 'No city set'}</div>
            </div>
          </div>
          <nav className="space-y-0.5">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold transition
                  ${activeSection === id
                    ? id === 'danger' ? 'bg-red-50 text-red-600' : 'bg-[#F0FAF8] text-[#0F766E]'
                    : id === 'danger' ? 'text-red-500 hover:bg-red-50' : 'text-[#6B7280] hover:bg-[#F8F8F7] hover:text-[#1F2937]'}`}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{label}</span>
                <ChevronRight size={14} className="opacity-40" />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex-1 min-w-0">

        {/* ── Personal Info ── */}
        {activeSection === 'personal' && (
          <div className="surface rounded-3xl p-8 animate-fade-in-up">
            <div className="mb-6">
              <p className="section-eyebrow">Account</p>
              <h2 className="mt-1 text-2xl font-extrabold text-[#1F2937]">Personal Information</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Update your name, contact details, and how you appear on ALAYAA.</p>
            </div>

            {/* Profile photo row */}
            <div className="mb-8 flex items-center gap-5 rounded-2xl bg-[#F8F8F7] p-5">
              <AvatarUpload initials={initials} avatarUrl={avatarUrl} onChange={setAvatarUrl} />
              <div>
                <div className="font-bold text-[#1F2937]">Profile photo</div>
                <div className="mt-0.5 text-sm text-[#6B7280]">Click the camera icon to upload. JPG or PNG, max 2MB.</div>
                {avatarUrl && (
                  <button
                    onClick={() => setAvatarUrl('')}
                    className="mt-2 text-xs font-bold text-red-500 hover:text-red-600"
                  >Remove photo</button>
                )}
              </div>
            </div>

            <form onSubmit={handlePersonalSave} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={personalErrors.fullName} required>
                  <input
                    className={`input-field ${personalErrors.fullName ? 'border-red-400' : ''}`}
                    value={personal.fullName}
                    onChange={e => setPersonal(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Your full name"
                  />
                </Field>

                <Field label="Email address" error={personalErrors.email} required>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="email"
                      className={`input-field pl-9 ${personalErrors.email ? 'border-red-400' : ''}`}
                      value={personal.email}
                      onChange={e => setPersonal(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                    />
                  </div>
                </Field>

                <Field label="Phone number" error={personalErrors.phone}>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      className={`input-field pl-9 ${personalErrors.phone ? 'border-red-400' : ''}`}
                      value={personal.phone}
                      onChange={e => setPersonal(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 99999 00000"
                    />
                  </div>
                </Field>

                <Field label="City">
                  <select
                    className="input-field"
                    value={personal.city}
                    onChange={e => setPersonal(p => ({ ...p, city: e.target.value }))}
                  >
                    <option value="">Select city</option>
                    {['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Short bio" hint="Shown to brokers when you make an inquiry">
                    <textarea
                      className="input-field resize-none"
                      rows={3}
                      value={personal.bio}
                      onChange={e => setPersonal(p => ({ ...p, bio: e.target.value }))}
                      placeholder="Tell brokers a bit about yourself and what you're looking for…"
                      maxLength={300}
                    />
                    <div className="mt-1 text-right text-xs text-[#6B7280]">{personal.bio.length}/300</div>
                  </Field>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button type="submit" disabled={saving} className="btn-primary rounded-2xl px-7 py-3 font-bold text-sm disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button type="button" className="btn-secondary rounded-2xl px-5 py-3 font-bold text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Password & Security ── */}
        {activeSection === 'security' && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="surface rounded-3xl p-8">
              <div className="mb-6">
                <p className="section-eyebrow">Security</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#1F2937]">Change Password</h2>
                <p className="mt-1 text-sm text-[#6B7280]">Use a strong, unique password to keep your account safe.</p>
              </div>

              <form onSubmit={handlePasswordChange} noValidate className="max-w-md space-y-4">
                <Field label="Current password" error={pwErrors.current} required>
                  <input
                    type="password"
                    className={`input-field ${pwErrors.current ? 'border-red-400' : ''}`}
                    value={passwords.current}
                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                    placeholder="••••••••"
                  />
                </Field>
                <Field label="New password" error={pwErrors.next} required hint="At least 8 characters">
                  <input
                    type="password"
                    className={`input-field ${pwErrors.next ? 'border-red-400' : ''}`}
                    value={passwords.next}
                    onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
                    placeholder="••••••••"
                  />
                  {passwords.next && (
                    <PasswordStrength password={passwords.next} />
                  )}
                </Field>
                <Field label="Confirm new password" error={pwErrors.confirm} required>
                  <input
                    type="password"
                    className={`input-field ${pwErrors.confirm ? 'border-red-400' : ''}`}
                    value={passwords.confirm}
                    onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="••••••••"
                  />
                </Field>
                <button type="submit" disabled={saving} className="btn-primary rounded-2xl px-7 py-3 font-bold text-sm mt-2 disabled:opacity-60">
                  {saving ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </div>

            {/* Active Sessions */}
            <div className="surface rounded-3xl p-8">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-[#0F766E]" />
                  <h3 className="text-lg font-extrabold text-[#1F2937]">Active Sessions</h3>
                </div>
                <p className="mt-1 text-sm text-[#6B7280]">Devices where you are currently logged in.</p>
              </div>
              <div className="space-y-3">
                {[
                  { device: 'Chrome on MacOS', location: 'Chennai, TN', time: 'Now (current)', active: true },
                  { device: 'Mobile App · iOS', location: 'Chennai, TN', time: '2 hours ago', active: false },
                ].map((s, i) => (
                  <div key={i} className={`flex items-center justify-between rounded-2xl p-4 ${s.active ? 'bg-[#F0FAF8] border border-[#0F766E]/20' : 'bg-[#F8F8F7]'}`}>
                    <div>
                      <div className="font-bold text-sm text-[#1F2937]">{s.device}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6B7280]">
                        <MapPin size={11} /> {s.location} · {s.time}
                      </div>
                    </div>
                    {s.active
                      ? <span className="rounded-full bg-[#0F766E] px-3 py-1 text-xs font-bold text-white">This device</span>
                      : <button className="text-xs font-bold text-red-500 hover:text-red-600">Sign out</button>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Notifications ── */}
        {activeSection === 'notifications' && (
          <div className="surface rounded-3xl p-8 animate-fade-in-up">
            <div className="mb-6">
              <p className="section-eyebrow">Preferences</p>
              <h2 className="mt-1 text-2xl font-extrabold text-[#1F2937]">Notification Settings</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Choose what updates you want to receive from ALAYAA.</p>
            </div>

            <div className="space-y-1">
              {[
                { key: 'newListings', label: 'New property listings', desc: 'When new properties matching your saved searches are listed' },
                { key: 'priceDrops', label: 'Price drops', desc: 'When prices change on properties you have saved or viewed' },
                { key: 'inquiryUpdates', label: 'Inquiry status updates', desc: 'When a broker responds to or updates your inquiries' },
                { key: 'brokerMessages', label: 'Broker messages', desc: 'Direct messages from brokers about your inquiries' },
                { key: 'weeklyDigest', label: 'Weekly market digest', desc: 'A weekly summary of Tamil Nadu property market trends' },
                { key: 'smsAlerts', label: 'SMS alerts', desc: 'Critical alerts sent to your registered phone number' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between rounded-2xl p-4 hover:bg-[#F8F8F7] transition-colors">
                  <div className="pr-6">
                    <div className="font-bold text-sm text-[#1F2937]">{label}</div>
                    <div className="mt-0.5 text-xs text-[#6B7280]">{desc}</div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={notifications[key]}
                    onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                    className={`relative shrink-0 h-6 w-11 rounded-full transition-colors ${notifications[key] ? 'bg-[#0F766E]' : 'bg-[#E5E7EB]'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
              <button onClick={handleNotificationsSave} disabled={saving} className="btn-primary rounded-2xl px-7 py-3 font-bold text-sm disabled:opacity-60">
                {saving ? 'Saving…' : 'Save preferences'}
              </button>
            </div>
          </div>
        )}
        {/* ── Danger Zone ── */}
        {activeSection === 'danger' && (
          <div className="surface rounded-3xl p-8 animate-fade-in-up border-red-100">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-red-500">Irreversible actions</p>
              <h2 className="mt-1 text-2xl font-extrabold text-[#1F2937]">Danger Zone</h2>
              <p className="mt-1 text-sm text-[#6B7280]">These actions cannot be undone. Please proceed carefully.</p>
            </div>

            <div className="space-y-4 max-w-lg">
              {/* Deactivate */}
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <div className="mb-3">
                  <div className="font-bold text-[#1F2937]">Deactivate account</div>
                  <div className="mt-0.5 text-sm text-[#6B7280]">Temporarily hides your profile and pauses all notifications. You can reactivate any time.</div>
                </div>
                <button className="rounded-xl border border-orange-300 bg-white px-4 py-2.5 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors">
                  Deactivate my account
                </button>
              </div>

              {/* Delete */}
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="mb-3">
                  <div className="font-bold text-[#1F2937]">Delete account permanently</div>
                  <div className="mt-0.5 text-sm text-[#6B7280]">Permanently removes your account, all saved properties, and inquiry history. This cannot be reversed.</div>
                </div>
                <div className="mt-3">
                  <label className="mb-2 block text-xs font-bold text-red-600">
                    Type <span className="font-mono bg-red-100 px-1.5 py-0.5 rounded">DELETE</span> to confirm
                  </label>
                  <div className="flex gap-3">
                    <input
                      className="input-field border-red-300 focus:border-red-500 focus:shadow-none text-sm"
                      placeholder="DELETE"
                      value={deleteConfirm}
                      onChange={e => setDeleteConfirm(e.target.value)}
                    />
                    <button
                      disabled={deleteConfirm !== 'DELETE'}
                      onClick={handleDeleteAccount}
                      className="shrink-0 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, children, error, hint, required }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1 text-sm font-bold text-[#1F2937]">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-[#6B7280]">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  )
}

function PasswordStrength({ password }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length

  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-[#0F766E]']

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : 'bg-[#E5E7EB]'}`} />
        ))}
      </div>
      {score > 0 && <p className="mt-1 text-xs text-[#6B7280]">Password strength: <span className="font-bold">{labels[score - 1]}</span></p>}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function CustomerDashboard() {

  const { user, logout } = useAuth()

  const [tab, setTab] = useState('overview')
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState([])
  const [favorites, setFavorites] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [toast, setToast] = useState('')
  const [savingFavorite, setSavingFavorite] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      if (!user?.id) return
      setLoading(true)
      try {
        const [allProperties, favs, userEnquiries] = await Promise.all([
          fetchProperties({ status: '' }),
          fetchFavorites(user.id),
          fetchCustomerEnquiries(user.id),
        ])
        if (!active) return
        setProperties(allProperties)

        console.log("All Properties:", allProperties)
console.log("Properties Count:", allProperties?.length)
        setFavorites(favs)
        setEnquiries(userEnquiries)
      } catch (error) {
        if (active) setToast(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [user?.id])

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.property_id)), [favorites])
  const cities = useMemo(() => [...new Set(properties.map((property) => property.city).filter(Boolean))], [properties])
  const types = useMemo(() => [...new Set(properties.map((property) => property.property_type).filter(Boolean))], [properties])

  const visibleProperties = useMemo(() => {
    return properties.filter((property) => {
      const term = query.trim().toLowerCase()
      const matchesQuery = !term || [property.title, property.location, property.city, property.description]
        .join(' ')
        .toLowerCase()
        .includes(term)
      const matchesCity = !city || property.city === city
      const matchesType = !propertyType || property.property_type === propertyType
      return matchesQuery && matchesCity && matchesType
    })
  }, [properties, query, city, propertyType])

  const favoriteProperties = useMemo(
    () => favorites.map((favorite) => favorite.property).filter(Boolean),
    [favorites],
  )

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const togglePropertyFavorite = async (propertyId) => {
    if (!user?.id) return
    setSavingFavorite(propertyId)
    try {
      await toggleFavorite(user.id, propertyId)
      const freshFavorites = await fetchFavorites(user.id)
      setFavorites(freshFavorites)
      setToast(favoriteIds.has(propertyId) ? 'Removed from favorites.' : 'Saved to favorites.')
    } catch (error) {
      setToast(error.message)
    } finally {
      setSavingFavorite('')
    }
  }

  const stats = [
    { label: 'Saved properties', value: favorites.length, icon: Heart },
    { label: 'Active enquiries', value: enquiries.length, icon: MessageSquare },
    { label: 'Listings available', value: properties.length, icon: Home },
    { label: 'Profile complete', value: user?.profile?.full_name ? 'Yes' : 'No', icon: User },
  ]

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-[#E5E7EB] bg-white p-5 lg:flex lg:flex-col">
        <Link to="/" className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] font-extrabold text-white">A</div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Customer</div>
            <div className="text-xl font-extrabold text-[#134E4A]">ALAYAA</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-2">
          {[
            ['overview', 'Overview', Home],
            ['browse', 'Browse', Search],
            ['favorites', 'Favorites', Heart],
            ['enquiries', 'Enquiries', MessageSquare],
            ['profile', 'Profile', User],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                tab === id ? 'bg-[#0F766E] text-white' : 'text-[#6B7280] hover:bg-[#F0FAF8] hover:text-[#0F766E]'
              }`}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#6B7280] hover:bg-[#F8F8F7]"
        >
          <LogOut size={17} /> Logout
        </button>
      </aside>

      <main className="p-5 lg:ml-64 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="section-eyebrow">Buyer workspace</p>
              <h1 className="mt-2 text-4xl font-extrabold text-[#1F2937]">
                Welcome back, {user?.profile?.full_name || 'Customer'}
              </h1>
              <p className="mt-2 text-[#6B7280]">{user?.email || user?.profile?.email}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge>{user?.profile?.role || 'customer'}</Badge>
              <Badge>{user?.profile?.city || 'No city set'}</Badge>
            </div>
          </div>

          {toast ? <Toast text={toast} onClose={() => setToast('')} /> : null}

          {tab === 'overview' ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="surface rounded-[28px] p-6">
                    <Icon size={22} className="mb-5 text-[#0F766E]" />
                    <div className="text-3xl font-extrabold text-[#1F2937]">{value}</div>
                    <div className="mt-1 text-sm text-[#6B7280]">{label}</div>
                  </div>
                ))}
              </div>

              <section className="surface rounded-[28px] p-6 sm:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#1F2937]">Recommended properties</h2>
                    <p className="mt-1 text-sm text-[#6B7280]">Handpicked active listings from across Tamil Nadu.</p>
                  </div>
                  <button onClick={() => setTab('browse')} className="btn-secondary rounded-2xl px-4 py-2.5 font-bold">
                    Browse all
                  </button>
                </div>
                <PropertyGrid properties={visibleProperties.slice(0, 4)} favoriteIds={favoriteIds} onFavorite={togglePropertyFavorite} savingFavorite={savingFavorite} />
              </section>
            </div>
          ) : null}

          {tab === 'browse' ? (
            <section className="surface rounded-[28px] p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1F2937]">Browse properties</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">Search, filter, and save homes you want to revisit.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field icon={Search}>
                    <input className="input-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search properties" />
                  </Field>
                  <Field icon={Filter}>
                    <select className="input-field" value={city} onChange={(event) => setCity(event.target.value)}>
                      <option value="">All cities</option>
                      {cities.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </Field>
                  <Field icon={Building2}>
                    <select className="input-field" value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                      <option value="">All types</option>
                      {types.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-20 text-[#6B7280]">
                  <Loader2 className="mr-2 animate-spin" size={18} /> Loading properties...
                </div>
              ) : visibleProperties.length ? (
                <PropertyGrid properties={visibleProperties} favoriteIds={favoriteIds} onFavorite={togglePropertyFavorite} savingFavorite={savingFavorite} />
              ) : (
                <EmptyState title="No matching properties" description="Adjust your search or filters to see more active listings." />
              )}
            </section>
          ) : null}

          {tab === 'favorites' ? (
            <section className="surface rounded-[28px] p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-[#1F2937]">Saved properties</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Homes and apartments you have bookmarked.</p>
              <div className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-20 text-[#6B7280]">
                    <Loader2 className="mr-2 animate-spin" size={18} /> Loading favorites...
                  </div>
                ) : favoriteProperties.length ? (
                  <PropertyGrid properties={favoriteProperties} favoriteIds={favoriteIds} onFavorite={togglePropertyFavorite} savingFavorite={savingFavorite} />
                ) : (
                  <EmptyState title="No favorites yet" description="Tap the heart icon on a property to save it here." />
                )}
              </div>
            </section>
          ) : null}

          {tab === 'enquiries' ? (
            <section className="surface rounded-[28px] p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-[#1F2937]">Your enquiries</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Track conversations with brokers and property owners.</p>
              <div className="mt-6 space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-20 text-[#6B7280]">
                    <Loader2 className="mr-2 animate-spin" size={18} /> Loading enquiries...
                  </div>
                ) : enquiries.length ? (
                  enquiries.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-base font-extrabold text-[#1F2937]">{item.property?.title || 'Property enquiry'}</div>
                          <div className="mt-1 text-sm text-[#6B7280]">{item.property?.location || item.property?.city || ''}</div>
                        </div>
                        <Badge>{item.status}</Badge>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#6B7280]">{item.message}</p>
                    </div>
                  ))
                ) : (
                  <EmptyState title="No enquiries yet" description="When you contact a broker, the conversation will appear here." />
                )}
              </div>
            </section>
          ) : null}

          {tab === 'profile' ? (
            <ProfileEditor title="Profile management" subtitle="Update your account information and avatar instantly." />
          ) : null}

              <PropertyStrip title="Recommendations" items={recommendations} />
            </>
          )}

          {tab === 'saved' && <PropertyStrip title="Saved Properties and Wishlist" items={saved} />}
          {tab === 'activity' && <PropertyStrip title="Recently Viewed" items={properties.slice(2, 6)} />}
          {tab === 'profile' && <ProfileTab showToast={showToast} />}

        </div>
      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  )
}

function PropertyGrid({ properties, favoriteIds, onFavorite, savingFavorite }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
      {properties.map((property) => (
        <article key={property.id} className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white shadow-sm">
          <div className="relative h-52 bg-[#F8F8F7]">
            <img
              src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop'}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => onFavorite(property.id)}
              className="absolute right-4 top-4 rounded-full bg-white/95 p-2.5 text-[#0F766E] shadow"
            >
              <Heart size={16} className={favoriteIds.has(property.id) ? 'fill-current text-[#0F766E]' : ''} />
            </button>
          </div>
          <div className="space-y-3 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#F0FAF8] px-3 py-1 text-xs font-bold text-[#0F766E]">{property.property_type}</span>
              <span className="rounded-full bg-[#F8F8F7] px-3 py-1 text-xs font-bold text-[#6B7280]">{property.city}</span>
            </div>
            <Link to={`/property/${property.id}`} className="block text-xl font-extrabold text-[#1F2937] hover:text-[#0F766E]">
              {property.title}
            </Link>
            <div className="flex items-center gap-1 text-sm text-[#6B7280]">
              <MapPin size={14} className="text-[#0F766E]" />
              {property.location}
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="text-xl font-extrabold text-[#134E4A]">{formatPrice(property.price)}</div>
              <button
                onClick={() => onFavorite(property.id)}
                disabled={savingFavorite === property.id}
                className="rounded-2xl bg-[#F0FAF8] px-4 py-2 text-sm font-bold text-[#0F766E] disabled:opacity-60"
              >
                {savingFavorite === property.id ? 'Saving...' : favoriteIds.has(property.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#E5E7EB] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FAF8] text-[#0F766E]">
        <Sparkles size={20} />
      </div>
      <div className="mt-4 text-lg font-extrabold text-[#1F2937]">{title}</div>
      <p className="mt-2 text-sm text-[#6B7280]">{description}</p>
    </div>
  )
}

function Field({ icon: Icon, children }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
      <div className="pl-11">{children}</div>
    </div>
  )
}

function Badge({ children }) {
  return <span className="rounded-full bg-[#F0FAF8] px-3 py-1 text-xs font-bold text-[#0F766E]">{children}</span>
}

function Toast({ text, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#134E4A] px-5 py-4 text-sm font-bold text-white shadow-xl">
      {text}
      <button onClick={onClose} className="ml-4 text-white/70 hover:text-white">x</button>
    </div>
  )
}
