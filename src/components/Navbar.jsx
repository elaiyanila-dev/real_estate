import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, ChevronDown, Home, Menu, Search, ShieldCheck, UserRound, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { tamilNaduCities } from '../data/properties.js'
import PostPropertyModal from './PostPropertyModal.jsx'

const navLinks = [
  { label: 'Buy', href: '#featured' },
  { label: 'Rent', href: '#featured' },
  { label: 'Commercial', href: '#featured' },
  { label: 'New Projects', href: '#featured' },
  { label: 'Plots', href: '#featured' },
  { label: 'Map View', scrollTo: 'map' },
  { label: 'Services', scrollTo: 'services' },
]

const AlayaaLogo = () => (
  <div className="flex items-center gap-2">
    {/* House icon */}
    <svg
      width="36"
      height="36"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 22 L24 4 L44 22"
        stroke="#0F766E"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 22 L8 44 L40 44 L40 22"
        stroke="#0F766E"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 44 L18 32 L30 32 L30 44"
        stroke="#0F766E"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    {/* Text */}
    <div className="flex flex-col leading-none">
      <span className="text-[10px] font-semibold tracking-[2px] text-[#6B7280] uppercase">
        real estate
      </span>
      <span className="text-[28px] font-black tracking-[-1px] leading-none text-[#0F766E]">
        ALAYAA
      </span>
    </div>
  </div>
)
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [citiesOpen, setCitiesOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [activeMega, setActiveMega] = useState(null)
  const [showPostModal, setShowPostModal] = useState(false)

  const handleMegaToggle = (label) => {
    setActiveMega(activeMega === label ? null : label)
  }

  const closeAll = () => {
    setActiveMega(null)
    setOpen(false)
    setSignInOpen(false)
    setCitiesOpen(false)
  }

  return (
    <>
    <nav className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        <Link to="/" className="flex items-center gap-3" onClick={closeAll}>
          <AlayaaLogo />
        </Link>

        {/* Rest of your navigation remains same as last version */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => {
            const isMega = ['Buy', 'Rent', 'Commercial', 'New Projects', 'Plots'].includes(item.label)
            const alignRight = ['New Projects', 'Plots'].includes(item.label)
            
            return (
              <div key={item.label} className="relative">
                {!isMega && item.to ? (
  <Link
    to={item.to}
    onClick={closeAll}
    className="rounded-full px-4 py-2 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F0FAF8] hover:text-[#0F766E] flex items-center gap-1"
  >
    {item.label}
  </Link>
) : (
  <button
    onClick={() => {
      if (item.scrollTo) {
        document.getElementById(item.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
        closeAll()
      } else if (isMega) {
        handleMegaToggle(item.label)
      }
    }}
    onMouseEnter={() => isMega && setActiveMega(item.label)}
    className="rounded-full px-4 py-2 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F0FAF8] hover:text-[#0F766E] flex items-center gap-1"
  >
    {item.label}
    {isMega && <ChevronDown size={16} className={`transition ${activeMega === item.label ? 'rotate-180' : ''}`} />}
  </button>
)}
                <AnimatePresence>
                  {isMega && activeMega === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      onMouseLeave={() => setActiveMega(null)}
                      className={`absolute top-[58px] w-[680px] bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-8 grid grid-cols-12 z-[60] max-h-[460px] overflow-auto ${alignRight ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
                    >
                      {/* Dropdown content remains same */}
                      <div className="col-span-5">
                        <p className="uppercase text-xs tracking-widest text-gray-500 mb-5 font-semibold">POPULAR CITIES</p>
                        <div className="grid grid-cols-2 gap-y-3 text-[15px] text-gray-700">
                          {tamilNaduCities.slice(0, 14).map((city) => (
                            <a key={city} href="#cities" onClick={closeAll} className="hover:text-[#0F766E] transition py-0.5">
                              {city}
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-4 border-l border-gray-100 pl-8">
                        <p className="uppercase text-xs tracking-widest text-gray-500 mb-5 font-semibold">
                          {item.label === 'New Projects' ? 'NEW PROJECTS' : item.label === 'Commercial' ? 'COMMERCIAL' : 'PLOTS & LAND'}
                        </p>
                        <div className="space-y-3 text-[15px] text-gray-700">
                          {item.label === 'New Projects' ? (
                            <>
                              <a href="#featured" className="block hover:text-[#0F766E]">Luxury Projects</a>
                              <a href="#featured" className="block hover:text-[#0F766E]">Under Construction</a>
                            </>
                          ) : item.label === 'Commercial' ? (
                            <>
                              <a href="#featured" className="block hover:text-[#0F766E]">Office Spaces</a>
                              <a href="#featured" className="block hover:text-[#0F766E]">Retail Shops</a>
                            </>
                          ) : (
                            <>
                              <a href="#featured" className="block hover:text-[#0F766E]">Residential Plots</a>
                              <a href="#featured" className="block hover:text-[#0F766E]">Commercial Plots</a>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3 border-l border-gray-100 pl-8">
                        <a href="#featured" className="flex items-center gap-3 text-sm hover:text-[#0F766E]">
                          <Home size={20} /> Featured Properties
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {/* Tamil Nadu Cities Button (unchanged) */}
          <div className="relative">
            <button onClick={() => setCitiesOpen(!citiesOpen)} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F0FAF8] hover:text-[#0F766E]">
              Tamil Nadu Cities <ChevronDown size={15} className={citiesOpen ? 'rotate-180 transition' : 'transition'} />
            </button>
            <AnimatePresence>
              {citiesOpen && (
                <motion.div className="absolute left-0 mt-3 grid w-72 grid-cols-2 gap-1 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xl z-[60]">
                  {tamilNaduCities.map((city) => (
                    <a key={city} href="#cities" onClick={closeAll} className="rounded-xl px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F0FAF8] hover:text-[#0F766E]">
                      {city}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side buttons remain the same */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <button onClick={() => setSignInOpen((v) => !v)} className="btn-secondary flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
              <UserRound size={16} /> Sign in
              <ChevronDown size={14} className={signInOpen ? 'rotate-180 transition' : 'transition'} />
            </button>
            {/* sign in dropdown */}
            <AnimatePresence>
              {signInOpen && (
                <motion.div className="absolute right-0 mt-3 w-52 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl z-[60]">
                  <Link to="/admin/login" onClick={closeAll} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#1F2937] hover:bg-[#F0FAF8] hover:text-[#0F766E]">
                    <ShieldCheck size={17} className="text-[#0F766E]" /> Admin Login
                  </Link>
                  <Link to="/login" onClick={closeAll} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#1F2937] hover:bg-[#F0FAF8] hover:text-[#0F766E]">
                    <UserRound size={17} className="text-[#0F766E]" /> User Login
                  </Link>
                  <Link to="/broker/login" onClick={closeAll} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#1F2937] hover:bg-[#F0FAF8] hover:text-[#0F766E]">
                    <Building2 size={17} className="text-[#0F766E]" /> Broker Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button onClick={() => setShowPostModal(true)} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">
            Post Property
          </button>
        </div>

        <button className="rounded-xl border border-[#E5E7EB] p-2 text-[#1F2937] md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu - same as before */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-[#E5E7EB] bg-white px-4 py-4 md:hidden">
            {/* ... your original mobile menu ... */}
            <div className="mb-3 flex items-center gap-2 rounded-2xl bg-[#F8F8F7] px-3 py-2">
              <Search size={16} className="text-[#0F766E]" />
              <span className="text-sm text-[#6B7280]">Search Chennai, Coimbatore, Madurai...</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => (
  item.to ? (
    <Link key={item.label} to={item.to} onClick={closeAll} className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-semibold">
      {item.label}
    </Link>
  ) : (
    <a key={item.label}
  href={item.href ?? `#${item.scrollTo}`}
  onClick={(e) => {
    if (item.scrollTo) {
      e.preventDefault()
      document.getElementById(item.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
    }
    closeAll()
  }}
  className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-semibold"
>
  {item.label}
</a>
  )
))}
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/login" className="btn-secondary flex-1 rounded-xl px-4 py-2 text-center text-sm font-semibold">Sign in</Link>
              <button onClick={() => { setOpen(false); setShowPostModal(true) }} className="btn-primary flex-1 rounded-xl px-4 py-2 text-center text-sm font-semibold">
                Post Property
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

    {showPostModal && <PostPropertyModal onClose={() => setShowPostModal(false)} />}
    </>
  )
}