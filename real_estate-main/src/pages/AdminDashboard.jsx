import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BarChart3, Building2, CheckCircle2, Clock, LayoutDashboard, ListChecks, LogOut, Plus, Search, Settings, Users } from 'lucide-react'
import { properties } from '../data/properties.js'

const analytics = [
  { label: 'Total Properties', value: '10,840', change: '+14%', icon: Building2 },
  { label: 'Pending Approval', value: '128', change: '-9%', icon: Clock },
  { label: 'Active Listings', value: '8,926', change: '+22%', icon: CheckCircle2 },
  { label: 'User Analytics', value: '42.7K', change: '+18%', icon: BarChart3 },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('dashboard')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(() => properties.filter((property) =>
    `${property.title} ${property.city} ${property.propertyType}`.toLowerCase().includes(query.toLowerCase())
  ), [query])

  return (
    <div className="min-h-screen bg-[#F8F8F7]">
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 border-r border-[#E5E7EB] bg-white p-5 lg:flex lg:flex-col">
        <Link to="/" className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] font-extrabold text-white">A</div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Admin</div>
            <div className="text-xl font-extrabold text-[#134E4A]">ALAYAA</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-2">
          {[
            ['dashboard', 'Dashboard', LayoutDashboard],
            ['listings', 'Listings', ListChecks],
            ['users', 'Users', Users],
            ['settings', 'Settings', Settings],
          ].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${tab === id ? 'bg-[#0F766E] text-white' : 'text-[#6B7280] hover:bg-[#F0FAF8] hover:text-[#0F766E]'}`}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#6B7280] hover:bg-[#F8F8F7]">
          <LogOut size={17} /> Logout
        </button>
      </aside>

      <main className="p-5 lg:ml-64 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="section-eyebrow">Operations</p>
              <h1 className="mt-2 text-4xl font-extrabold text-[#1F2937]">Admin Dashboard</h1>
              <p className="mt-2 text-[#6B7280]">Tamil Nadu listings, approvals, and user growth at a glance.</p>
            </div>
            <button className="btn-primary flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold"><Plus size={17} /> Add Listing</button>
          </div>

          {tab === 'dashboard' && (
            <>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {analytics.map(({ label, value, change, icon: Icon }) => (
                  <div key={label} className="surface rounded-3xl p-6">
                    <Icon size={22} className="mb-5 text-[#0F766E]" />
                    <div className="text-3xl font-extrabold text-[#1F2937]">{value}</div>
                    <div className="mt-1 text-sm text-[#6B7280]">{label}</div>
                    <div className="mt-3 text-sm font-bold text-[#0F766E]">{change} this month</div>
                  </div>
                ))}
              </div>
              <div className="surface rounded-3xl p-6">
                <h2 className="mb-4 text-xl font-extrabold">Approval Queue</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {properties.slice(0, 3).map((property) => (
                    <div key={property.id} className="rounded-3xl border border-[#E5E7EB] p-4">
                      <div className="font-bold text-[#1F2937]">{property.title}</div>
                      <div className="mt-1 text-sm text-[#6B7280]">{property.location}</div>
                      <div className="mt-3 text-sm font-extrabold text-[#134E4A]">{property.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'listings' && (
            <div className="surface rounded-3xl p-6">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-extrabold">Manage Listings</h2>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0F766E]" />
                  <input className="input-field w-full pl-10 md:w-80" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search listings" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] text-left text-[#6B7280]">
                      <th className="py-3">Property</th>
                      <th>City</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filtered.map((property) => (
                      <tr key={property.id}>
                        <td className="py-4 font-bold text-[#1F2937]">{property.title}</td>
                        <td>{property.city}</td>
                        <td>{property.propertyType}</td>
                        <td className="font-bold text-[#134E4A]">{property.price}</td>
                        <td><span className="rounded-full bg-[#F0FAF8] px-3 py-1 text-xs font-bold text-[#0F766E]">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab !== 'dashboard' && tab !== 'listings' && (
            <div className="surface rounded-3xl p-12 text-center text-[#6B7280]">This workspace is ready for the next admin module.</div>
          )}
        </div>
      </main>
    </div>
  )
}
