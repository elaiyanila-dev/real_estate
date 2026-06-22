import { useState, useRef } from 'react'
import { X, Home, Briefcase, Building2, ChevronRight, ChevronLeft, Check, Camera, Plus, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ROLES = [
  { id: 'owner',   icon: Home,      title: 'Owner',            subtitle: 'I own the property and want to list it', accent: 'border-blue-200 hover:border-blue-500 bg-blue-50',   iconColor: 'text-blue-600' },
  { id: 'broker',  icon: Briefcase, title: 'Agent / Broker',   subtitle: 'I am a registered broker or agent',       accent: 'border-purple-200 hover:border-purple-500 bg-purple-50', iconColor: 'text-purple-600' },
  { id: 'builder', icon: Building2, title: 'Builder / Developer', subtitle: 'I represent a construction firm',      accent: 'border-orange-200 hover:border-orange-500 bg-orange-50', iconColor: 'text-orange-600' },
]

const PROPERTY_TYPES = ['Flat / Apartment', 'Independent House / Villa', 'Independent Floor', 'Plot / Land', 'Commercial', '1 RK / Studio']
const TN_CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Tiruppur', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Thanjavur', 'Dindigul', 'Pollachi']
const AMENITIES = [
  { key: 'lift', label: 'Lift' }, { key: 'parking', label: 'Parking' }, { key: 'gym', label: 'Gym' },
  { key: 'pool', label: 'Swimming Pool' }, { key: 'security', label: '24/7 Security' },
  { key: 'power', label: 'Power Backup' }, { key: 'water', label: '24/7 Water' }, { key: 'garden', label: 'Garden' },
]

function formatINR(val) {
  const n = parseInt(val)
  if (!n) return ''
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

export default function PostPropertyModal({ onClose }) {
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(0)      // 0=role, 1=property, 2=photos, 3=contact
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const [form, setForm] = useState({
    role: '',
    intent: 'sell',
    propertyType: '',
    bhk: '',
    totalArea: '',
    city: '',
    locality: '',
    price: '',
    furnishing: 'unfurnished',
    amenities: [],
    description: '',
    photos: [],
    name: '',
    phone: '',
    email: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleAmenity = (k) => set('amenities', form.amenities.includes(k) ? form.amenities.filter(a => a !== k) : [...form.amenities, k])

  const validate = (s) => {
    const e = {}
    if (s === 1) {
      if (!form.propertyType) e.propertyType = 'Select a property type'
      if (!form.city)         e.city = 'Select a city'
      if (!form.locality)     e.locality = 'Enter locality'
      if (!form.price)        e.price = 'Enter price'
    }
    if (s === 2) {
      if (form.photos.length === 0) e.photos = 'Upload at least 1 photo'
    }
    if (s === 3) {
      if (!form.name)                            e.name = 'Enter your name'
      if (!form.phone || form.phone.length < 10) e.phone = 'Enter valid 10-digit number'
      if (!form.email || !form.email.includes('@')) e.email = 'Enter valid email'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleRole = (id) => { set('role', id); setStep(1) }
  const next = () => { if (validate(step)) setStep(s => s + 1) }
  const back = () => { setErrors({}); setStep(s => s - 1) }

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files)
    const newPhotos = files.slice(0, 10 - form.photos.length).map(f => ({
      id: Math.random().toString(36).slice(2),
      preview: URL.createObjectURL(f), file: f,
    }))
    set('photos', [...form.photos, ...newPhotos])
  }

  const handleSubmit = () => {
    if (!validate(3)) return
    setDone(true)
  }

  const STEP_LABELS = ['Role', 'Property Details', 'Photos', 'Your Details']

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col"
          style={{ maxHeight: '90vh' }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#1F2937]">Post Your Property</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">Free listing · No brokerage charged</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 mt-0.5"><X size={20} /></button>
            </div>

            {/* Step bar — only show after role selection */}
            {step > 0 && !done && (
              <div className="flex items-center gap-1 mt-4">
                {STEP_LABELS.slice(1).map((label, i) => {
                  const idx = i + 1
                  const isActive = step === idx
                  const isDone = step > idx
                  return (
                    <div key={label} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                          ${isDone ? 'bg-[#0F766E] text-white' : isActive ? 'bg-[#134E4A] text-white' : 'bg-gray-200 text-gray-400'}`}>
                          {isDone ? <Check size={12} /> : idx}
                        </div>
                        <span className={`text-[10px] mt-0.5 ${isActive ? 'text-[#0F766E] font-semibold' : 'text-gray-400'}`}>{label}</span>
                      </div>
                      {i < 2 && <div className={`flex-1 h-0.5 mb-4 mx-1 ${isDone ? 'bg-[#0F766E]' : 'bg-gray-200'}`} />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Body — scrollable */}
          <div className="overflow-y-auto flex-1 px-6 py-5">

            {/* SUCCESS */}
            {done && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={30} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Property Posted!</h3>
                <p className="text-sm text-gray-500 mb-1">Your listing is now live on ALAYAA.</p>
                <p className="text-xs text-gray-400">Enquiries will be sent to <strong>{form.phone}</strong></p>
                <button onClick={onClose} className="mt-6 w-full py-3 bg-[#0F766E] text-white rounded-xl font-semibold text-sm hover:bg-[#0D6660]">
                  Done
                </button>
              </div>
            )}

            {/* STEP 0 — Role */}
            {!done && step === 0 && (
              <div className="flex flex-col gap-3">
                {ROLES.map(({ id, icon: Icon, title, subtitle, accent, iconColor }) => (
                  <button key={id} onClick={() => handleRole(id)}
                    className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${accent}`}>
                    <div className="rounded-lg bg-white p-2 shadow-sm"><Icon size={20} className={iconColor} /></div>
                    <div>
                      <p className="font-semibold text-[#1F2937]">{title}</p>
                      <p className="text-xs text-[#6B7280]">{subtitle}</p>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {/* STEP 1 — Property Details */}
            {!done && step === 1 && (
              <div className="space-y-4">
                {/* Intent */}
                <div>
                  <label className="modal-label">You're looking to</label>
                  <div className="flex gap-2 mt-1">
                    {['sell', 'rent'].map(v => (
                      <button key={v} onClick={() => set('intent', v)}
                        className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold capitalize transition-all
                          ${form.intent === v ? 'border-[#0F766E] bg-[#F0FAF8] text-[#134E4A]' : 'border-gray-200 text-gray-600 hover:border-[#0F766E]/40'}`}>
                        {v === 'sell' ? 'Sell' : 'Rent / Lease'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="modal-label">Property Type *</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {PROPERTY_TYPES.map(pt => (
                      <button key={pt} onClick={() => set('propertyType', pt)}
                        className={`py-2 px-3 rounded-lg border-2 text-xs font-medium text-left transition-all
                          ${form.propertyType === pt ? 'border-[#0F766E] bg-[#F0FAF8] text-[#134E4A]' : 'border-gray-200 text-gray-600 hover:border-[#0F766E]/40'}`}>
                        {pt}
                      </button>
                    ))}
                  </div>
                  {errors.propertyType && <Err msg={errors.propertyType} />}
                </div>

                {/* BHK + Area */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="modal-label">BHK</label>
                    <select className="modal-input mt-1" value={form.bhk} onChange={e => set('bhk', e.target.value)}>
                      <option value="">Select</option>
                      {['1 RK','1 BHK','2 BHK','3 BHK','4 BHK','4+ BHK'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="modal-label">Total Area (sq.ft) *</label>
                    <input className="modal-input mt-1" type="number" placeholder="e.g. 1200"
                      value={form.totalArea} onChange={e => set('totalArea', e.target.value)} />
                  </div>
                </div>

                {/* City + Locality */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="modal-label">City *</label>
                    <select className="modal-input mt-1" value={form.city} onChange={e => set('city', e.target.value)}>
                      <option value="">Select</option>
                      {TN_CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    {errors.city && <Err msg={errors.city} />}
                  </div>
                  <div>
                    <label className="modal-label">Locality *</label>
                    <input className="modal-input mt-1" placeholder="e.g. Anna Nagar"
                      value={form.locality} onChange={e => set('locality', e.target.value)} />
                    {errors.locality && <Err msg={errors.locality} />}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="modal-label">{form.intent === 'sell' ? 'Expected Price (₹) *' : 'Monthly Rent (₹) *'}</label>
                  <input className="modal-input mt-1" type="number"
                    placeholder={form.intent === 'sell' ? 'e.g. 5000000' : 'e.g. 15000'}
                    value={form.price} onChange={e => set('price', e.target.value)} />
                  {form.price && <p className="text-xs text-green-600 mt-1 font-medium">{formatINR(form.price)}</p>}
                  {errors.price && <Err msg={errors.price} />}
                </div>

                {/* Furnishing */}
                <div>
                  <label className="modal-label">Furnishing</label>
                  <div className="flex gap-2 mt-1">
                    {[['unfurnished','Unfurnished'],['semi','Semi-Furnished'],['full','Fully Furnished']].map(([v,l]) => (
                      <button key={v} onClick={() => set('furnishing', v)}
                        className={`flex-1 py-2 rounded-lg border-2 text-xs font-semibold transition-all
                          ${form.furnishing === v ? 'border-[#0F766E] bg-[#F0FAF8] text-[#134E4A]' : 'border-gray-200 text-gray-600 hover:border-[#0F766E]/40'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="modal-label">Amenities</label>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    {AMENITIES.map(am => (
                      <button key={am.key} onClick={() => toggleAmenity(am.key)}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all
                          ${form.amenities.includes(am.key) ? 'border-[#0F766E] bg-[#F0FAF8] text-[#134E4A]' : 'border-gray-200 text-gray-500 hover:border-[#0F766E]/40'}`}>
                        {am.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="modal-label">Description</label>
                  <textarea className="modal-input mt-1 resize-none" rows={3}
                    placeholder="Describe your property, highlights, nearby landmarks..."
                    value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
              </div>
            )}

            {/* STEP 2 — Photos */}
            {!done && step === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500">Properties with photos get <strong>5x more enquiries</strong>. Upload up to 10 photos.</p>

                <div onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#0F766E] hover:bg-[#F0FAF8] transition-all">
                  <Camera size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600">Click to upload photos</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG · Max 10 photos</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                </div>

                {form.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {form.photos.map((p, i) => (
                      <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                        <img src={p.preview} alt="" className="w-full h-full object-cover" />
                        {i === 0 && <span className="absolute top-1 left-1 bg-[#0F766E] text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold">Cover</span>}
                        <button onClick={() => set('photos', form.photos.filter(x => x.id !== p.id))}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    {form.photos.length < 10 && (
                      <button onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#0F766E] hover:text-[#0F766E] transition-all">
                        <Plus size={20} /><span className="text-xs mt-1">Add</span>
                      </button>
                    )}
                  </div>
                )}
                {errors.photos && <Err msg={errors.photos} />}
              </div>
            )}

            {/* STEP 3 — Contact Details */}
            {!done && step === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500">Buyers will contact you on these details. These are kept private and secure.</p>

                <div>
                  <label className="modal-label">Full Name *</label>
                  <input className="modal-input mt-1" placeholder="Your name"
                    value={form.name} onChange={e => set('name', e.target.value)} />
                  {errors.name && <Err msg={errors.name} />}
                </div>

                <div>
                  <label className="modal-label">Phone Number *</label>
                  <div className="flex mt-1">
                    <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 font-medium">+91</span>
                    <input className="modal-input rounded-l-none" type="tel" maxLength={10}
                      placeholder="10-digit mobile number"
                      value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  {errors.phone && <Err msg={errors.phone} />}
                </div>

                <div>
                  <label className="modal-label">Email Address *</label>
                  <input className="modal-input mt-1" type="email" placeholder="your@email.com"
                    value={form.email} onChange={e => set('email', e.target.value)} />
                  {errors.email && <Err msg={errors.email} />}
                </div>

                <div className="p-3 bg-[#F0FAF8] border border-[#0F766E]/20 rounded-lg text-xs text-[#134E4A]">
                  🔒 Your details are protected. ALAYAA never shares your contact info with third parties.
                </div>
              </div>
            )}
          </div>

          {/* Footer nav */}
          {!done && step > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between gap-3 flex-shrink-0">
              <button onClick={back}
                className="flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                <ChevronLeft size={16} /> Back
              </button>
              {step < 3 ? (
                <button onClick={next}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-bold hover:bg-[#0D6660] transition-all">
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all">
                  <Check size={16} /> Post Property
                </button>
              )}
            </div>
          )}

          <style>{`
            .modal-label { font-size: 0.75rem; font-weight: 600; color: #374151; }
            .modal-input { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #111827; outline: none; transition: border-color 0.15s; }
            .modal-input:focus { border-color: #0F766E; box-shadow: 0 0 0 3px rgba(15,118,110,0.08); }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Err({ msg }) {
  return <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{msg}</p>
}
