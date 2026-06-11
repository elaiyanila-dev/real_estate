import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Eye, Heart, Home, LogOut, MapPin, Sparkles, User } from 'lucide-react'
import { properties } from '../data/properties.js'

const stats = [
  { label: 'Saved Properties', value: 6, icon: Heart },
  { label: 'Wishlist', value: 4, icon: Sparkles },
  { label: 'Recently Viewed', value: 18, icon: Eye },
  { label: 'Recommendations', value: 12, icon: Home },
]

export default function CustomerDashboard() {
  const [tab, setTab] = useState('overview')
  const navigate = useNavigate()
  const saved = properties.slice(0, 4)
  const recommendations = properties.slice(4, 8)

  return (
    <div className="min-h-screen bg-[#F8F8F7]">
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 border-r border-[#E5E7EB] bg-white p-5 lg:flex lg:flex-col">
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
            ['saved', 'Saved', Heart],
            ['activity', 'Recently Viewed', Bell],
            ['profile', 'Profile', User],
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
          <div className="mb-8">
            <p className="section-eyebrow">Buyer workspace</p>
            <h1 className="mt-2 text-4xl font-extrabold text-[#1F2937]">Welcome back, Rahul</h1>
            <p className="mt-2 text-[#6B7280]">Your saved homes, wishlist, recent views, and curated Tamil Nadu recommendations.</p>
          </div>

          {tab === 'overview' && (
            <>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="surface rounded-3xl p-6">
                    <Icon size={22} className="mb-5 text-[#0F766E]" />
                    <div className="text-3xl font-extrabold text-[#1F2937]">{value}</div>
                    <div className="mt-1 text-sm text-[#6B7280]">{label}</div>
                  </div>
                ))}
              </div>
              <PropertyStrip title="Recommendations" items={recommendations} />
            </>
          )}

          {tab === 'saved' && <PropertyStrip title="Saved Properties and Wishlist" items={saved} />}
          {tab === 'activity' && <PropertyStrip title="Recently Viewed" items={properties.slice(2, 6)} />}
          {tab === 'profile' && (
            <div className="surface rounded-3xl p-10 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F0FAF8] text-[#0F766E]"><User size={34} /></div>
              <h2 className="text-2xl font-extrabold">Rahul Kumar</h2>
              <p className="mt-1 text-[#6B7280]">rahul@alayaa.in</p>
              <button className="btn-primary mt-6 rounded-2xl px-6 py-3 font-bold">Edit Profile</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function PropertyStrip({ title, items }) {
  return (
    <div className="surface rounded-3xl p-6">
      <h2 className="mb-5 text-2xl font-extrabold text-[#1F2937]">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((property) => (
          <div key={property.id} className="rounded-3xl border border-[#E5E7EB] bg-white p-4">
            <div className="flex gap-4">
              <img src={property.image} alt={property.title} className="h-24 w-28 rounded-2xl object-cover" />
              <div>
                <div className="font-extrabold text-[#1F2937]">{property.title}</div>
                <div className="mt-1 flex items-center gap-1 text-sm text-[#6B7280]"><MapPin size={14} className="text-[#0F766E]" /> {property.location}</div>
                <div className="mt-2 font-extrabold text-[#134E4A]">{property.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
