import React from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const groups = {
  Property: ['Buy', 'Rent', 'Commercial', 'New Projects', 'Plots'],
  Cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Hosur'],
  Company: ['About', 'Careers', 'Partners', 'Privacy', 'Terms'],
}

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_2fr] lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E] text-lg font-extrabold text-white">A</div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B7280]">Tamil Nadu Realty</div>
              <div className="text-xl font-extrabold text-[#134E4A]">ALAYAA</div>
            </div>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#6B7280]">A premium real estate platform for verified homes, plots, villas, and commercial spaces across Tamil Nadu.</p>
          <div className="mt-6 space-y-3 text-sm text-[#6B7280]">
            <p className="flex items-center gap-2"><Phone size={15} className="text-[#0F766E]" /> 1800-ALAYAA-TN</p>
            <p className="flex items-center gap-2"><Mail size={15} className="text-[#0F766E]" /> support@alayaa.in</p>
            <p className="flex items-center gap-2"><MapPin size={15} className="text-[#0F766E]" /> Chennai, Tamil Nadu</p>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {Object.entries(groups).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-extrabold text-[#1F2937]">{title}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link}><a href="#" className="text-sm text-[#6B7280] transition hover:text-[#0F766E]">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[#E5E7EB] py-5 text-center text-sm text-[#6B7280]">
        Copyright 2026 ALAYAA. All rights reserved.
      </div>
    </footer>
  )
}
