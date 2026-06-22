import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="surface flex flex-col gap-4 rounded-[28px] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-eyebrow">ALAYAA</p>
            <h1 className="mt-2 text-4xl font-extrabold text-[#1F2937]">Tamil Nadu real estate, built for production.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">
              Browse verified homes, save favorites, send enquiries, and manage broker workflows with Supabase Auth and RLS.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary rounded-2xl px-5 py-3 font-bold">Customer Login</Link>
            <Link to="/broker/login" className="btn-secondary rounded-2xl px-5 py-3 font-bold">Broker Login</Link>
            <Link to="/admin/login" className="btn-secondary rounded-2xl px-5 py-3 font-bold">Admin Login</Link>
          </div>
        </header>
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Verified profiles', 'Customers, brokers, and admins share one secure profile system.'],
            ['Broker approvals', 'Pending, approved, and rejected states are handled in Supabase.'],
            ['Secure media', 'Profile pictures and property images are stored in Supabase Storage.'],
          ].map(([title, description]) => (
            <div key={title} className="surface rounded-[28px] p-6">
              <h2 className="text-xl font-extrabold text-[#1F2937]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">{description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

