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

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0))
}

export default function CustomerDashboard() {
  const { user, logout } = useAuth()
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
          fetchProperties({ status: 'active' }),
          fetchFavorites(user.id),
          fetchCustomerEnquiries(user.id),
        ])
        if (!active) return
        setProperties(allProperties)
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
        </div>
      </main>
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
