
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, Loader2, MapPin, MessageSquare, Phone, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import {
  createEnquiry,
  fetchProfileById,
  fetchFavorites,
  fetchPropertyById,
  toggleFavorite,
} from '../services/api.jsx'

function formatPrice(value) {
  if (!Number.isFinite(value)) return 'On request'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

export default function PropertyDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [broker, setBroker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingFavorite, setSavingFavorite] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [enquiry, setEnquiry] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchPropertyById(id)
        if (!mounted) return
        setProperty(data)
        if (user?.id) {
          const currentFavorites = await fetchFavorites(user.id)
          if (mounted) {
            setIsFavourite(currentFavorites.some((favorite) => favorite.property_id === data.id))
          }
        }
        if (data?.broker_id) {
          const brokerProfile = await fetchProfileById(data.broker_id)
          if (mounted) setBroker(brokerProfile)
        }
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [id, user?.id])

  const images = useMemo(() => property?.images || [], [property])

  const handleFavourite = async () => {
    if (!user?.id) {
      setMessage('Please sign in to save this property.')
      return
    }
    setSavingFavorite(true)
    setMessage('')
    try {
      const result = await toggleFavorite(user.id, property.id)
      setIsFavourite(result.favorited)
      setMessage(result.favorited ? 'Added to your favorites.' : 'Removed from your favorites.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingFavorite(false)
    }
  }

  const handleEnquiry = async (event) => {
    event.preventDefault()
    if (!user?.id) {
      setMessage('Please sign in to send an enquiry.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await createEnquiry({
        customer_id: user.id,
        customer_email: user.email,
        customer_name: user.profile?.full_name || '',
        property_id: property.id,
        broker_id: property.broker_id,
        broker_email: broker?.email || '',
        property_title: property.title,
        message: enquiry,
      })
      setEnquiry('')
      setMessage('Your enquiry has been sent successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] text-[#6B7280]">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Loading property...
      </div>
    )
  }

  if (error && !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4">
        <div className="surface max-w-lg rounded-[28px] p-8 text-center">
          <p className="text-sm font-semibold text-rose-600">{error}</p>
          <Link to="/" className="mt-4 inline-flex btn-primary rounded-2xl px-5 py-3 font-bold">
            Back to home
          </Link>
        </div>

import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, BadgeCheck, BedDouble, Building2,
  Bus, Car, Heart, MapPin, Maximize2,
  Phone, Mail, Plane, School, Share2,
  TrainFront, X, Hospital
} from 'lucide-react'
import { motion } from 'framer-motion'
import { properties } from '../data/properties.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

// ── Enquiry Modal ──────────────────────────────────────────────
function EnquiryModal({ property, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1 text-[#6B7280] hover:bg-[#F8F8F7]"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0FAF8]">
              <BadgeCheck size={32} className="text-[#0F766E]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#134E4A]">Enquiry Sent!</h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Our team will call you within 24 hours regarding{' '}
              <span className="font-semibold text-[#1F2937]">{property.title}</span>
            </p>
            <button onClick={onClose} className="btn-primary mt-6 rounded-2xl px-8 py-3 font-bold">
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-extrabold text-[#1F2937]">Enquire About This Property</h3>
            <p className="mt-1 text-sm text-[#6B7280]">{property.title} · {property.location}</p>
            <form onSubmit={submit} className="mt-5 space-y-4">
              {[
                { name: 'name',  label: 'Full Name',    type: 'text',  placeholder: 'Enter your name'         },
                { name: 'phone', label: 'Phone Number', type: 'tel',   placeholder: '+91 98765 43210'          },
                { name: 'email', label: 'Email Address',type: 'email', placeholder: 'you@email.com (optional)' },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="mb-1 block text-sm font-bold text-[#1F2937]">{label}</label>
                  <input
                    type={type} name={name} value={form[name]}
                    onChange={handle} placeholder={placeholder}
                    className="input-field"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-sm font-bold text-[#1F2937]">Message (Optional)</label>
                <textarea
                  name="message" value={form.message} onChange={handle}
                  rows={3} placeholder="Any specific requirements..."
                  className="input-field resize-none"
                />
              </div>
              <button type="submit" className="btn-primary w-full rounded-2xl py-3 font-bold">
                Send Enquiry
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}

// ── Property Detail Page ───────────────────────────────────────
export default function PropertyDetail() {
  const { id } = useParams()
  const property = properties.find(p => p.id === parseInt(id))
  const [saved, setSaved]           = useState(false)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [copied, setCopied]         = useState(false)

  const similar = properties
    .filter(p => p.city === property?.city && p.id !== property?.id)
    .slice(0, 3)

  const mapsUrl = property
    ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
    : '#'

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── 404 ──
  if (!property) {
    return (
      <div className="app-shell">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <Building2 size={48} className="text-[#E5E7EB]" />
          <h2 className="text-2xl font-extrabold text-[#1F2937]">Property Not Found</h2>
          <p className="text-[#6B7280]">This listing may have been removed.</p>
          <Link to="/" className="btn-primary rounded-2xl px-6 py-3 font-bold">
            Back to Home
          </Link>
        </div>
        <Footer />

      </div>
    )
  }


  if (!property) return null

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="text-sm font-bold text-[#6B7280] hover:text-[#0F766E]">
            Back to listings
          </Link>
          <button
            onClick={handleFavourite}
            disabled={savingFavorite}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold text-[#1F2937] shadow-sm transition hover:border-[#0F766E]/30 hover:text-[#0F766E] disabled:opacity-60"
          >
            <Heart size={16} className={isFavourite ? 'fill-current text-[#0F766E]' : ''} />
            {savingFavorite ? 'Saving...' : isFavourite ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_.85fr]">
          <section className="surface overflow-hidden rounded-[28px]">
            {images.length ? (
              <div className="grid gap-1 sm:grid-cols-2">
                {images.slice(0, 4).map((src, index) => (
                  <img
                    key={`${src}-${index}`}
                    src={src}
                    alt={property.title}
                    className={`h-64 w-full object-cover ${index === 0 ? 'sm:col-span-2 sm:h-96' : 'sm:h-48'}`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center bg-[#F8F8F7] text-[#6B7280]">
                No images available
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#F0FAF8] px-3 py-1 text-xs font-bold text-[#0F766E]">
                  {property.property_type}
                </span>
                <span className="rounded-full bg-[#F8F8F7] px-3 py-1 text-xs font-bold text-[#6B7280]">
                  {property.status}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#1F2937]">{property.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={16} className="text-[#0F766E]" />
                  {property.location}, {property.city}
                </span>
                <span>{property.bedrooms} beds</span>
                <span>{property.bathrooms} baths</span>
                <span>{property.area} sq ft</span>
              </div>
              <div className="mt-5 text-3xl font-extrabold text-[#134E4A]">{formatPrice(property.price)}</div>
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#6B7280]">{property.description}</p>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="surface rounded-[28px] p-6">
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#6B7280]">Broker</div>
              <div className="flex items-center gap-4">
                <Avatar profile={broker} />
                <div>
                  <div className="text-lg font-extrabold text-[#1F2937]">{broker?.full_name || 'Broker'}</div>
                  <div className="text-sm text-[#6B7280]">{broker?.city || 'Tamil Nadu'}</div>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-[#6B7280]">
                {broker?.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-[#0F766E]" />
                    {broker.phone}
                  </div>
                ) : null}
                {broker?.email ? (
                  <div className="flex items-center gap-2">
                    <MessageSquare size={15} className="text-[#0F766E]" />
                    {broker.email}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="surface rounded-[28px] p-6">
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#6B7280]">Send enquiry</div>
              {message ? <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
              {error ? <p className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</p> : null}
              <form onSubmit={handleEnquiry} className="space-y-4">
                <label className="block text-sm font-bold text-[#1F2937]">
                  Message
                  <textarea
                    className="input-field mt-2 min-h-32 resize-none"
                    value={enquiry}
                    onChange={(event) => setEnquiry(event.target.value)}
                    placeholder="Tell the broker what you are looking for..."
                    required
                  />
                </label>
                <button type="submit" disabled={submitting} className="btn-primary w-full rounded-2xl py-3 font-bold disabled:opacity-60">
                  {submitting ? 'Sending...' : 'Send enquiry'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Avatar({ profile }) {
  const initials = profile?.full_name
    ? profile.full_name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : 'B'

  return profile?.profile_picture ? (
    <img src={profile.profile_picture} alt={profile?.full_name || 'Broker'} className="h-14 w-14 rounded-2xl object-cover" />
  ) : (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FAF8] text-sm font-extrabold text-[#0F766E]">
      {initials}
    </div>
  )
}

  const nearbyConfig = {
    school:   { icon: School,     label: 'School'    },
    hospital: { icon: Hospital,   label: 'Hospital'  },
    railway:  { icon: TrainFront, label: 'Railway'   },
    airport:  { icon: Plane,      label: 'Airport'   },
    busStand: { icon: Bus,        label: 'Bus Stand' },
  }

  return (
    <div className="app-shell">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-[#6B7280]">
          <Link to="/" className="flex items-center gap-1 font-semibold text-[#0F766E] hover:underline">
            <ArrowLeft size={15} /> Home
          </Link>
          <span>/</span>
          <span>{property.city}</span>
          <span>/</span>
          <span className="font-semibold text-[#1F2937]">{property.title}</span>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8 overflow-hidden rounded-3xl">
          <img
            src={property.image} alt={property.title}
            className="h-[260px] w-full object-cover sm:h-[380px] lg:h-[460px]"
          />
          {/* Left badges */}
          <div className="absolute left-4 top-4 flex gap-2">
            {property.verified && (
              <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0F766E]">
                <BadgeCheck size={13} /> Verified
              </span>
            )}
            <span className="rounded-full bg-[#0F766E] px-3 py-1 text-xs font-bold text-white">
              {property.listingType}
            </span>
          </div>
          {/* Right buttons */}
          <div className="absolute right-4 top-4 flex gap-2">
            <button onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition">
              <Share2 size={17} className="text-[#1F2937]" />
            </button>
            <button onClick={() => setSaved(v => !v)}
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition ${saved ? 'text-rose-500' : 'text-[#1F2937]'}`}>
              <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
          {/* Copied toast */}
          {copied && (
            <div className="absolute bottom-4 right-4 rounded-2xl bg-[#134E4A] px-4 py-2 text-sm font-bold text-white shadow">
              Link copied!
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-6">

            {/* Title + Price + Stats */}
            <div className="surface rounded-3xl p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#1F2937] sm:text-3xl">
                    {property.title}
                  </h1>
                  <p className="mt-2 flex items-center gap-1 text-sm text-[#6B7280]">
                    <MapPin size={15} className="text-[#0F766E]" /> {property.location}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-2xl font-extrabold text-[#134E4A] sm:text-3xl">
                    {property.price}
                  </div>
                  <div className="mt-1 text-xs text-[#6B7280]">
                    {property.propertyType} · For {property.listingType}
                  </div>
                </div>
              </div>

              {/* 3 stat boxes */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { icon: BedDouble, label: 'BHK',     value: property.bhk ? `${property.bhk} BHK` : 'Plot' },
                  { icon: Maximize2, label: 'Area',     value: property.area                                  },
                  { icon: Car,       label: 'Parking',  value: property.parking                               },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl bg-[#F8F8F7] p-4 text-center">
                    <Icon size={20} className="mx-auto mb-2 text-[#0F766E]" />
                    <div className="text-xs text-[#6B7280]">{label}</div>
                    <div className="mt-1 text-sm font-extrabold text-[#1F2937]">{value}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[property.furnishing, property.propertyType, property.city].map(tag => (
                  <span key={tag}
                    className="rounded-full border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#6B7280]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="surface rounded-3xl p-6">
              <p className="section-eyebrow mb-1">What's included</p>
              <h2 className="text-xl font-extrabold text-[#1F2937]">Amenities</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {property.amenities.map(a => (
                  <span key={a}
                    className="flex items-center gap-1.5 rounded-2xl bg-[#F0FAF8] px-4 py-2 text-sm font-semibold text-[#0F766E]">
                    <BadgeCheck size={14} /> {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Nearby */}
            <div className="surface rounded-3xl p-6">
              <p className="section-eyebrow mb-1">Distance from property</p>
              <h2 className="text-xl font-extrabold text-[#1F2937]">Nearby</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(property.nearby).map(([key, value]) => {
                  const config = nearbyConfig[key]
                  if (!config) return null
                  const Icon = config.icon
                  return (
                    <div key={key}
                      className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8F8F7] px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0FAF8]">
                        <Icon size={17} className="text-[#0F766E]" />
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280]">{config.label}</div>
                        <div className="text-sm font-extrabold text-[#134E4A]">{value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Map */}
            <div className="surface rounded-3xl p-6">
              <p className="section-eyebrow mb-1">Location</p>
              <h2 className="mb-4 text-xl font-extrabold text-[#1F2937]">
                {property.locality}, {property.city}
              </h2>
              <a href={mapsUrl} target="_blank" rel="noreferrer"
                className="group relative block overflow-hidden rounded-2xl">
                <div className="flex h-[200px] w-full items-center justify-center flex-col gap-3 rounded-2xl bg-[#F0FAF8] border border-[#E5E7EB]">
                  <MapPin size={36} className="text-[#0F766E]" />
                  <p className="text-sm font-bold text-[#134E4A]">{property.locality}, {property.city}</p>
                  <p className="text-xs text-[#6B7280]">{property.latitude}°N, {property.longitude}°E</p>
                  <span className="rounded-full bg-[#0F766E] px-4 py-2 text-xs font-bold text-white">
                    Open in Google Maps
                  </span>
                </div>
              </a>
            </div>

            {/* Similar Properties */}
            {similar.length > 0 && (
              <div>
                <p className="section-eyebrow mb-1">More in {property.city}</p>
                <h2 className="mb-4 text-xl font-extrabold text-[#1F2937]">Similar Properties</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {similar.map(p => (
                    <Link to={`/property/${p.id}`} key={p.id}
                      className="surface card-hover overflow-hidden rounded-3xl block">
                      <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />
                      <div className="p-4">
                        <div className="font-extrabold text-[#1F2937] line-clamp-1">{p.title}</div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-[#6B7280]">
                          <MapPin size={12} className="text-[#0F766E]" /> {p.locality}
                        </div>
                        <div className="mt-2 font-extrabold text-[#134E4A]">{p.price}</div>
                        <div className="mt-1 text-xs text-[#6B7280]">
                          {p.bhk ? `${p.bhk} BHK · ` : ''}{p.area}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN — Sticky Card ── */}
          <div>
            <div className="sticky top-24 space-y-4">

              {/* Contact Card */}
              <div className="surface rounded-3xl p-6">
                <div className="text-3xl font-extrabold text-[#134E4A]">{property.price}</div>
                <div className="mt-1 text-sm text-[#6B7280]">
                  {property.propertyType} · For {property.listingType}
                </div>
                <button onClick={() => setShowEnquiry(true)}
                  className="btn-primary mt-5 w-full rounded-2xl py-3 font-bold">
                  Contact Broker
                </button>
                <a href="tel:1800-ALAYAA"
                  className="btn-secondary mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold">
                  <Phone size={16} /> Call Now
                </a>
                <button onClick={() => setShowEnquiry(true)}
                  className="btn-secondary mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold">
                  <Mail size={16} /> Email Broker
                </button>
                <p className="mt-4 text-center text-xs text-[#6B7280]">
                  Free, no-obligation enquiry
                </p>
              </div>

              {/* Quick Info */}
              <div className="surface rounded-3xl p-5">
                <h3 className="mb-3 text-sm font-extrabold text-[#1F2937]">Quick Info</h3>
                {[
                  { label: 'Property Type', value: property.propertyType },
                  { label: 'Listed For',    value: property.listingType  },
                  { label: 'Furnishing',    value: property.furnishing   },
                  { label: 'Parking',       value: property.parking      },
                  { label: 'City',          value: property.city         },
                  { label: 'Locality',      value: property.locality     },
                ].map(({ label, value }) => (
                  <div key={label}
                    className="flex justify-between border-b border-[#F3F4F6] py-2 last:border-0">
                    <span className="text-xs text-[#6B7280]">{label}</span>
                    <span className="text-xs font-bold text-[#1F2937]">{value}</span>
                  </div>
                ))}
              </div>

              {/* Verified Badge */}
              {property.verified && (
                <div className="flex items-center gap-3 rounded-3xl bg-[#F0FAF8] p-4">
                  <BadgeCheck size={22} className="flex-shrink-0 text-[#0F766E]" />
                  <div>
                    <div className="text-sm font-extrabold text-[#134E4A]">Verified Listing</div>
                    <div className="text-xs text-[#6B7280]">
                      Location, documents & seller verified by ALAYAA
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <Footer />

      {showEnquiry && (
        <EnquiryModal property={property} onClose={() => setShowEnquiry(false)} />
      )}
    </div>
  )
}
