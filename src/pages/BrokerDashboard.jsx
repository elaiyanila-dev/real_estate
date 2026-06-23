import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  LogOut,
  MessageSquare,
  Plus,
  ShieldAlert,
  User,
  Loader2,
  Pencil,
  Trash2,
  Upload,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import ProfileEditor from '../components/ProfileEditor.jsx'
import LocationPicker from '../components/LocationPicker.jsx'
import {
  createProperty,
  deleteProperty,
  fetchBrokerDashboard,
  fetchProperties,
  updateProperty,
  uploadPropertyImages,
} from '../services/api.jsx'

const emptyForm = {
  title: '',
  description: '',
  price: '',
  location: '',
  city: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  property_type: 'Apartment',
  status: 'active',
  images: [],
  latitude: null,
  longitude: null,
}
function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

export default function BrokerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState({ properties: [], enquiries: [], approval: null, stats: { totalProperties: 0, totalEnquiries: 0, pendingEnquiries: 0 } })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [fileList, setFileList] = useState([])
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const approvalStatus = dashboard.approval?.status || user?.profile?.brokerApproval?.status || 'pending'
  const isApproved = !approvalStatus || approvalStatus === 'approved' || approvalStatus === 'pending'

  useEffect(() => {
    let active = true

    const load = async () => {
      if (!user?.id) return
      setLoading(true)
      try {
        const data = await fetchBrokerDashboard(user.id)
        if (!active) return
        setDashboard(data)
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

  const visibleProperties = useMemo(() => {
    return dashboard.properties.filter((property) => {
      const matchesQuery = !query || [property.title, property.location, property.city, property.description]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
      const matchesStatus = !filterStatus || property.status === filterStatus
      return matchesQuery && matchesStatus
    })
  }, [dashboard.properties, query, filterStatus])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const startEdit = (property) => {
    setEditingId(property.id)
    setForm({
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      location: property.location || '',
      city: property.city || '',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      area: property.area || '',
      property_type: property.property_type || 'Apartment',
      status: property.status || 'active',
      images: property.images || [],
    })
    setFileList([])
    setTab('properties')
  }

  const resetForm = () => {
    setEditingId('')
    setForm(emptyForm)
    setFileList([])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isApproved) {
      setToast('Your broker account must be approved before managing listings.')
      return
    }

    setSaving(true)
    try {
      let imageUrls = form.images
      if (fileList.length) {
        const uploads = await uploadPropertyImages(fileList, user.id)
        imageUrls = [...form.images, ...uploads]
      }

      const payload = {
  ...form,
  price: Number(form.price) * 10000000,  
  images: imageUrls,
  broker_id: user.id,
}

      if (editingId) {
        await updateProperty(editingId, payload)
        setToast('Property updated successfully.')
      } else {
        await createProperty(payload)
        setToast('Property created successfully.')
      }

      const refreshed = await fetchBrokerDashboard(user.id)
      setDashboard(refreshed)
      resetForm()
    } catch (error) {
      setToast(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Delete this property permanently?')) return
    setSaving(true)
    try {
      await deleteProperty(propertyId)
      const refreshed = await fetchBrokerDashboard(user.id)
      setDashboard(refreshed)
      setToast('Property deleted.')
    } catch (error) {
      setToast(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-[#E5E7EB] bg-white p-5 lg:flex lg:flex-col">
        <Link to="/" className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] font-extrabold text-white">B</div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Broker</div>
            <div className="text-xl font-extrabold text-[#134E4A]">ALAYAA</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-2">
          {[
            ['overview', 'Overview', Building2],
            ['properties', 'Properties', Plus],
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
        <button onClick={handleLogout} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#6B7280] hover:bg-[#F8F8F7]">
          <LogOut size={17} /> Logout
        </button>
      </aside>

      <main className="p-5 lg:ml-64 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="section-eyebrow">Broker workspace</p>
                <h1 className="mt-2 text-4xl font-extrabold text-[#1F2937]">
                  Welcome back, {user?.profile?.full_name || 'Broker'}
                </h1>
                <p className="mt-2 text-[#6B7280]">{user?.email || user?.profile?.email}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <StatusPill>{approvalStatus}</StatusPill>
                <StatusPill>{user?.profile?.city || 'No city set'}</StatusPill>
              </div>
            </div>
            {!isApproved ? (
              <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                <ShieldAlert className="mr-2 inline-block" size={16} />
                {approvalStatus === 'rejected'
                  ? 'Your broker application was rejected. Contact support to review your account.'
                  : 'Your broker application is pending approval. You can view the dashboard but cannot publish properties yet.'}
              </div>
            ) : null}
          </div>

          {toast ? <Toast text={toast} onClose={() => setToast('')} /> : null}

          {tab === 'overview' ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Building2} label="My properties" value={dashboard.stats.totalProperties} />
                <StatCard icon={MessageSquare} label="Enquiries" value={dashboard.stats.totalEnquiries} />
                <StatCard icon={User} label="Profile ready" value={user?.profile?.full_name ? 'Yes' : 'No'} />
                <StatCard icon={ShieldAlert} label="Approval status" value={approvalStatus} />
              </div>
              <section className="surface rounded-[28px] p-6">
                <h2 className="text-2xl font-extrabold text-[#1F2937]">Latest enquiries</h2>
                <div className="mt-5 space-y-3">
                  {dashboard.enquiries.length ? dashboard.enquiries.slice(0, 3).map((item) => (
                    <div key={item.id} className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-extrabold text-[#1F2937]">{item.property?.title || 'Property enquiry'}</div>
                          <div className="mt-1 text-sm text-[#6B7280]">{item.property?.location || item.property?.city || ''}</div>
                        </div>
                        <StatusPill>{item.status}</StatusPill>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#6B7280]">{item.message}</p>
                    </div>
                  )) : <EmptyState title="No enquiries yet" description="Customer enquiries will appear here once your listings are live." />}
                </div>
              </section>
            </div>
          ) : null}

          {tab === 'properties' ? (
            <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
              <section className="surface rounded-[28px] p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#1F2937]">{editingId ? 'Edit property' : 'Add property'}</h2>
                    <p className="mt-1 text-sm text-[#6B7280]">Publish verified listings from your broker account.</p>
                  </div>
                  {editingId ? <button onClick={resetForm} className="text-sm font-bold text-[#0F766E]">Cancel edit</button> : null}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field label="Title">
                    <input className="input-field" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
                  </Field>
                  <Field label="Description">
                    <textarea className="input-field min-h-28 resize-none" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Price">
                      <input className="input-field" type="number" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} required />
                    </Field>
                    <Field label="Location">
                      <input className="input-field" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} required />
                    </Field>
                    <Field label="City">
                      <input className="input-field" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} required />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Pin on map">
                        <LocationPicker
                          latitude={form.latitude}
                          longitude={form.longitude}
                          onChange={({ latitude, longitude }) => setForm((current) => ({ ...current, latitude, longitude }))}
                        />
                      </Field>
                    </div>
                    <Field label="Property type">
                      <select className="input-field" value={form.property_type} onChange={(event) => setForm((current) => ({ ...current, property_type: event.target.value }))}>
                        {['Apartment', 'Villa', 'Plot', 'Independent House', 'Commercial', 'Studio'].map((type) => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </Field>
                    <Field label="Bedrooms">
                      <input className="input-field" type="number" value={form.bedrooms} onChange={(event) => setForm((current) => ({ ...current, bedrooms: event.target.value }))} />
                    </Field>
                    <Field label="Bathrooms">
                      <input className="input-field" type="number" value={form.bathrooms} onChange={(event) => setForm((current) => ({ ...current, bathrooms: event.target.value }))} />
                    </Field>
                    <Field label="Area (sq ft)">
                      <input className="input-field" type="number" value={form.area} onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))} />
                    </Field>
                    <Field label="Status">
                      <select className="input-field" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
                        {['active', 'draft', 'pending', 'sold', 'rented'].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="rounded-3xl border border-dashed border-[#E5E7EB] bg-[#F8F8F7] p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#1F2937]">
                      <Upload size={16} className="text-[#0F766E]" />
                      Property images
                    </div>
                    <p className="mt-1 text-xs text-[#6B7280]">Upload JPG or PNG images. They will be stored in Supabase Storage.</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="mt-4 block w-full text-sm text-[#6B7280]"
                      onChange={(event) => setFileList([...event.target.files])}
                    />
                    {form.images.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {form.images.map((url) => (
                          <img key={url} src={url} alt="Property" className="h-16 w-20 rounded-xl object-cover" />
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <button type="submit" disabled={saving || !isApproved} className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-bold disabled:opacity-60">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    {editingId ? 'Update property' : 'Create property'}
                  </button>
                </form>
              </section>

              <section className="surface rounded-[28px] p-6 sm:p-8">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#1F2937]">My listings</h2>
                    <p className="mt-1 text-sm text-[#6B7280]">Review, edit, and remove your published properties.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className="input-field" placeholder="Search listings" value={query} onChange={(event) => setQuery(event.target.value)} />
                    <select className="input-field" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                      <option value="">All statuses</option>
                      {['active', 'draft', 'pending', 'sold', 'rented'].map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-20 text-[#6B7280]">
                    <Loader2 className="mr-2 animate-spin" size={18} /> Loading properties...
                  </div>
                ) : visibleProperties.length ? (
                  <div className="space-y-4">
                    {visibleProperties.map((property) => (
                      <div key={property.id} className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-lg font-extrabold text-[#1F2937]">{property.title}</div>
                            <div className="mt-1 flex items-center gap-1 text-sm text-[#6B7280]">
                              <MapPin size={14} className="text-[#0F766E]" />
                              {property.location}, {property.city}
                            </div>
                          </div>
                          <StatusPill>{property.status}</StatusPill>
                        </div>
                        <div className="mt-3 text-sm leading-6 text-[#6B7280]">{property.description}</div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xl font-extrabold text-[#134E4A]">{formatPrice(property.price)}</div>
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(property)} className="rounded-2xl bg-[#F0FAF8] px-4 py-2 text-sm font-bold text-[#0F766E]">
                              <Pencil size={14} className="mr-1 inline-block" />
                              Edit
                            </button>
                            <button onClick={() => handleDelete(property.id)} className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600">
                              <Trash2 size={14} className="mr-1 inline-block" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No properties yet" description="Create your first listing to start generating enquiries." />
                )}
              </section>
            </div>
          ) : null}

          {tab === 'enquiries' ? (
            <section className="surface rounded-[28px] p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-[#1F2937]">Incoming enquiries</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Customer messages attached to your listings.</p>
              <div className="mt-6 space-y-3">
                {dashboard.enquiries.length ? dashboard.enquiries.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-extrabold text-[#1F2937]">{item.property?.title || 'Property enquiry'}</div>
                        <div className="mt-1 text-sm text-[#6B7280]">{item.property?.city || ''}</div>
                      </div>
                      <StatusPill>{item.status}</StatusPill>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[#6B7280]">{item.message}</p>
                  </div>
                )) : <EmptyState title="No enquiries yet" description="You will see customer enquiries here after properties go live." />}
              </div>
            </section>
          ) : null}

          {tab === 'profile' ? (
            <ProfileEditor title="Broker profile" subtitle="Update the information customers see on your public profile." />
          ) : null}
        </div>
      </main>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-bold text-[#1F2937]">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="surface rounded-[28px] p-6">
      <Icon size={22} className="mb-5 text-[#0F766E]" />
      <div className="text-3xl font-extrabold text-[#1F2937]">{value}</div>
      <div className="mt-1 text-sm text-[#6B7280]">{label}</div>
    </div>
  )
}

function StatusPill({ children }) {
  return <span className="rounded-full bg-[#F0FAF8] px-3 py-1 text-xs font-bold text-[#0F766E]">{children}</span>
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#E5E7EB] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FAF8] text-[#0F766E]">
        <Building2 size={20} />
      </div>
      <div className="mt-4 text-lg font-extrabold text-[#1F2937]">{title}</div>
      <p className="mt-2 text-sm text-[#6B7280]">{description}</p>
    </div>
  )
}

function Toast({ text, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#134E4A] px-5 py-4 text-sm font-bold text-white shadow-xl">
      {text}
      <button onClick={onClose} className="ml-4 text-white/70 hover:text-white">x</button>
    </div>
  )
}

