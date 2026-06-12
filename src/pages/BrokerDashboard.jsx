import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, MessageCircle, UserCircle, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { fetchBrokerListings } from '../services/api.js'

export default function BrokerDashboard() {
  const { user, logout } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    fetchBrokerListings(localStorage.getItem('alayaa_auth_token') || sessionStorage.getItem('alayaa_auth_token'))
      .then((data) => mounted && setListings(data))
      .catch(() => mounted && setListings([]))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F8F7]">
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 border-r border-[#E5E7EB] bg-white p-5 lg:flex lg:flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] font-extrabold text-white">B</div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Broker</div>
            <div className="text-xl font-extrabold text-[#134E4A]">ALAYAA</div>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            ['overview', 'Overview'],
            ['listings', 'My Listings'],
            ['inquiries', 'Inquiries'],
            ['profile', 'Profile'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => navigate(`#${id}`)} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#6B7280] hover:bg-[#F0FAF8] hover:text-[#0F766E]">
              <Building2 size={17} /> {label}
            </button>
          ))}
        </nav>
        <button onClick={() => { logout(); navigate('/') }} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#6B7280] hover:bg-[#F8F8F7]">
          <LogOut size={17} /> Logout
        </button>
      </aside>

      <main className="p-5 lg:ml-64 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="section-eyebrow">Broker workspace</p>
              <h1 className="mt-2 text-4xl font-extrabold text-[#1F2937]">Welcome back, {user?.fullName || 'Broker'}</h1>
              <p className="mt-2 text-[#6B7280]">Manage your listings, leads, and property performance from one place.</p>
            </div>
            <button className="btn-primary flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold"><Plus size={17} /> Add Listing</button>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Building2} label="My Listings" value={listings.length} />
            <StatCard icon={MessageCircle} label="Leads" value={17} />
            <StatCard icon={UserCircle} label="Profile Strength" value="85%" />
            <StatCard icon={Building2} label="Active Status" value="Verified" />
          </div>

          <section className="surface rounded-3xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#1F2937]">My Listings</h2>
                <p className="text-sm text-[#6B7280]">Recent property listings under your account.</p>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-16 text-[#6B7280]">Loading listings...</div>
            ) : listings.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {listings.map((property) => (
                  <div key={property.id} className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-[#134E4A]">{property.title}</h3>
                        <p className="mt-2 text-sm text-[#6B7280]">{property.location}</p>
                      </div>
                      <span className="rounded-full bg-[#F0FAF8] px-3 py-1 text-xs font-bold text-[#0F766E]">{property.propertyType}</span>
                    </div>
                    <div className="text-sm text-[#6B7280]">{property.description}</div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-[#0F766E]">
                      <span>{property.price}</span>
                      <button className="rounded-2xl bg-[#EFFCF7] px-4 py-2 text-sm font-bold text-[#0F766E]">Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center text-[#6B7280]">No listings found. Start by adding a new property listing.</div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="surface rounded-3xl p-6">
      <Icon size={22} className="mb-5 text-[#0F766E]" />
      <div className="text-3xl font-extrabold text-[#1F2937]">{value}</div>
      <div className="mt-1 text-sm text-[#6B7280]">{label}</div>
    </div>
  )
}
