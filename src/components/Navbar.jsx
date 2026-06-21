import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Menu, Search, UserRound, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { tamilNaduCities } from '../data/properties.js'

const navLinks = ['Buy', 'Rent', 'Commercial', 'New Projects', 'Plots', 'Map View', 'Services']

const AlayaaLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-lg font-extrabold text-white shadow-sm">
    A
  </div>
)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [citiesOpen, setCitiesOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)


  const linkTarget = (label) => {
    if (label === 'Map View') return '#map'
    if (label === 'Services') return '#services'
    if (label === 'Plots') return '#featured'
    return '#featured'
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <AlayaaLogo />
          <div className="leading-tight">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Tamil Nadu Realty</div>
            <div className="text-xl font-extrabold tracking-wide text-[#134E4A]">ALAYAA</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((label) => (
            <a
              key={label}
              href={linkTarget(label)}
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F0FAF8] hover:text-[#0F766E]"
            >
              {label}
            </a>
          ))}

          <div className="relative">
            <button
              onClick={() => setCitiesOpen((value) => !value)}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F0FAF8] hover:text-[#0F766E]"
            >
              Tamil Nadu Cities <ChevronDown size={15} className={citiesOpen ? 'rotate-180 transition' : 'transition'} />
            </button>
            <AnimatePresence>
              {citiesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 mt-3 grid w-72 grid-cols-2 gap-1 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xl"
                >
                  {tamilNaduCities.map((city) => (
                    <a key={city} href="#cities" className="rounded-xl px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F0FAF8] hover:text-[#0F766E]">
                      {city}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">

  <button
    onClick={() => setLoginOpen(!loginOpen)}
    className="btn-secondary flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
  >
    <UserRound size={16} />
    Sign In
    <ChevronDown size={14} />
  </button>

  <AnimatePresence>
    {loginOpen && (

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute right-0 mt-3 w-56 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl"
      >

        <Link
          to="/login"
          className="block rounded-lg px-4 py-3 hover:bg-[#F0FAF8]"
        >
          Customer Login
        </Link>

        <Link
          to="/broker/login"
          className="block rounded-lg px-4 py-3 hover:bg-[#F0FAF8]"
        >
          Broker Login
        </Link>

        <Link
          to="/admin/login"
          className="block rounded-lg px-4 py-3 hover:bg-[#F0FAF8]"
        >
          Admin Login
        </Link>

      </motion.div>

    )}    
  </AnimatePresence>

</div>
          <Link to="/broker/login" className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">
            Post Property
          </Link>
        </div>

        <button className="rounded-xl border border-[#E5E7EB] p-2 text-[#1F2937] md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#E5E7EB] bg-white px-4 py-4 md:hidden"
          >
            <div className="mb-3 flex items-center gap-2 rounded-2xl bg-[#F8F8F7] px-3 py-2">
              <Search size={16} className="text-[#0F766E]" />
              <span className="text-sm text-[#6B7280]">Search Chennai, Coimbatore, Madurai...</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((label) => (
                <a key={label} href={linkTarget(label)} onClick={() => setOpen(false)} className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-semibold">
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {tamilNaduCities.map((city) => (
                <a key={city} href="#cities" onClick={() => setOpen(false)} className="text-sm text-[#6B7280]">
                  {city}
                </a>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/login" className="btn-secondary flex-1 rounded-xl px-4 py-2 text-center text-sm font-semibold">Sign in</Link>
              <Link to="/broker/login" className="btn-primary flex-1 rounded-xl px-4 py-2 text-center text-sm font-semibold">Post</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
