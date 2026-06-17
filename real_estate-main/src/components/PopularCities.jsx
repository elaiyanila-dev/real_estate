import React from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { cityStats } from '../data/properties.js'

export default function PopularCities() {
  return (
    <section id="cities" className="bg-[#FAF9F6] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="section-eyebrow">Tamil Nadu markets</p>
          <h2 className="section-title mt-2 text-4xl md:text-5xl">Explore Popular Cities</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#6B7280]">City-wise supply, pricing, and demand signals for serious property decisions.</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {cityStats.map((city, index) => (
            <motion.article
              key={city.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04, duration: 0.45 }}
              whileHover={{ y: -5 }}
              className="group surface card-hover overflow-hidden rounded-3xl"
            >
              <div className="h-36 overflow-hidden">
                <img src={city.image} alt={city.name} className="image-zoom h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[#1F2937] transition-colors duration-200 group-hover:text-[#134E4A]">{city.name}</h3>
                  <ArrowUpRight size={17} className="text-[#0F766E] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="mt-2 flex items-center gap-1 text-sm text-[#6B7280]"><MapPin size={14} /> {city.count} properties</p>
                <p className="mt-1 text-sm font-semibold text-[#134E4A]">{city.avg}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
