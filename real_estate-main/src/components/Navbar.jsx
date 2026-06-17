import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, ChevronDown, Menu, Search, ShieldCheck, UserRound, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { tamilNaduCities } from '../data/properties.js'

const navLinks = ['Buy', 'Rent', 'Commercial', 'New Projects', 'Plots', 'Map View', 'Services']

const loginOptions = [
  { label: 'Admin Login', path: '/admin-login', icon: ShieldCheck },
  { label: 'User Login', path: '/user-login', icon: UserRound },
  { label: 'Broker Login', path: '/broker-login', icon: Building2 },
]

const AlayaaLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-lg font-extrabold text-white shadow-sm transition-transform duration-200 hover:scale-105">
    A
  </div>
)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [citiesOpen, setCitiesOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const citiesRef = useRef(null)
  const loginRef = useRef(null)
  const location = useLocation()

  const isLoginRoute = loginOptions.some((item) => location.pathname === item.path)

  const linkTarget = (label) => {
    if (label === 'Map View') return '#map'
    if (label === 'Services') return '#services'
    if (label === 'Plots') return '#featured'
    return '#featured'
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (citiesRef.current && !citiesRef.current.contains(event.target)) setCitiesOpen(false)
      if (loginRef.current && !loginRef.current.contains(event.target)) setLoginOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setOpen(false)
    setLoginOpen(false)
    setCitiesOpen(false)
  }, [location.pathname])

  const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } },
  }

  return (
    <nav className={`sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90">
          <AlayaaLogo />
          <div className="leading-tight">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Tamil Nadu Realty</div>
            <div className="text-xl font-extrabold tracking-wide text-[#134E4A]">ALAYAA</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((label) => (
            <a key={label} href={linkTarget(label)} className="nav-link">
              {label}
            </a>
          ))}

          <div className="relative" ref={citiesRef}>
            <button
              onClick={() => setCitiesOpen((value) => !value)}
              className="nav-link flex items-center gap-1"
            >
              Tamil Nadu Cities
              <ChevronDown size={15} className={`transition-transform duration-200 ${citiesOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {citiesOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute left-0 mt-3 grid w-72 grid-cols-2 gap-1 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xl"
                >
                  {tamilNaduCities.map((city) => (
                    <a
                      key={city}
                      href="#cities"
                      onClick={() => setCitiesOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm text-[#6B7280] transition-colors duration-200 hover:bg-[#F0FAF8] hover:text-[#0F766E]"
                    >
                      {city}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative" ref={loginRef}>
            <button
              onClick={() => setLoginOpen((value) => !value)}
              className={`btn-secondary flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${isLoginRoute ? 'border-[#0F766E]/32 bg-[#F0FAF8] text-[#0F766E]' : ''}`}
            >
              <UserRound size={16} />
              Sign in
              <ChevronDown size={14} className={`transition-transform duration-200 ${loginOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {loginOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white py-1.5 shadow-xl"
                >
                  {loginOptions.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setLoginOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                          isActive
                            ? 'bg-[#F0FAF8] text-[#0F766E]'
                            : 'text-[#1F2937] hover:bg-[#F0FAF8] hover:text-[#0F766E]'
                        }`}
                      >
                        <Icon size={16} className={isActive ? 'text-[#0F766E]' : 'text-[#6B7280]'} />
                        {item.label}
                      </Link>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/broker-login" className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">
            Post Property
          </Link>
        </div>

        <button className="rounded-xl border border-[#E5E7EB] p-2 text-[#1F2937] transition-colors duration-200 hover:bg-[#F0FAF8] md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#E5E7EB] bg-white px-4 py-4 md:hidden"
          >
            <div className="mb-3 flex items-center gap-2 rounded-2xl bg-[#F8F8F7] px-3 py-2">
              <Search size={16} className="text-[#0F766E]" />
              <span className="text-sm text-[#6B7280]">Search Chennai, Coimbatore, Madurai...</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((label) => (
                <a
                  key={label}
                  href={linkTarget(label)}
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:border-[#0F766E]/28 hover:bg-[#F0FAF8]"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {tamilNaduCities.map((city) => (
                <a key={city} href="#cities" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] transition-colors duration-200 hover:text-[#0F766E]">
                  {city}
                </a>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Sign in as</p>
              <div className="grid gap-2">
                {loginOptions.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                        isActive
                          ? 'border-[#0F766E]/32 bg-[#F0FAF8] text-[#0F766E]'
                          : 'border-[#E5E7EB] text-[#1F2937] hover:border-[#0F766E]/28 hover:bg-[#F0FAF8]'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="mt-4">
              <Link to="/broker-login" onClick={() => setOpen(false)} className="btn-primary block rounded-xl px-4 py-2.5 text-center text-sm font-semibold">
                Post Property
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
