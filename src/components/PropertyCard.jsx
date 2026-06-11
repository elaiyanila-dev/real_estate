import React, { useState } from 'react'
import { BadgeCheck, BedDouble, Heart, Map, MapPin, Maximize2, Scale, School, TrainFront, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PropertyCard({ property, selected = false, onCompareToggle = () => {} }) {
  const [saved, setSaved] = useState(false)
  const mapsUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`

  return (
    <motion.article whileHover={{ y: -4 }} className="surface card-hover overflow-hidden rounded-3xl">
      <div className="relative h-56 overflow-hidden">
        <img src={property.image} alt={property.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
        <button
          onClick={() => setSaved((value) => !value)}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow ${saved ? 'text-rose-500' : 'text-[#1F2937]'}`}
          aria-label="Save property"
        >
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
        {property.verified && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0F766E]">
            <BadgeCheck size={14} /> Verified
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-extrabold text-[#1F2937]">{property.title}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-[#6B7280]">
              <MapPin size={14} className="text-[#0F766E]" /> {property.location}
            </div>
          </div>
          <div className="whitespace-nowrap text-lg font-extrabold text-[#134E4A]">{property.price}</div>
        </div>

        <div className="my-4 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-2xl bg-[#F8F8F7] p-3"><BedDouble size={15} className="mb-1 text-[#0F766E]" />{property.bhk ? `${property.bhk} BHK` : property.propertyType}</div>
          <div className="rounded-2xl bg-[#F8F8F7] p-3"><Maximize2 size={15} className="mb-1 text-[#0F766E]" />{property.area}</div>
          <div className="rounded-2xl bg-[#F8F8F7] p-3"><Building2 size={15} className="mb-1 text-[#0F766E]" />{property.propertyType}</div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-[#6B7280]">
          <span className="flex items-center gap-1"><School size={13} className="text-[#0F766E]" /> School {property.nearby.school}</span>
          <span className="flex items-center gap-1"><TrainFront size={13} className="text-[#0F766E]" /> Rail {property.nearby.railway}</span>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#1F2937]">
            <input type="checkbox" checked={selected} onChange={() => onCompareToggle(property.id)} className="h-4 w-4 accent-[#0F766E]" />
            Compare
          </label>
          <Scale size={16} className="text-[#0F766E]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="btn-primary rounded-2xl px-4 py-3 text-sm font-bold">View Details</button>
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-secondary flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold">
            <Map size={16} /> View on Map
          </a>
        </div>
      </div>
    </motion.article>
  )
}
