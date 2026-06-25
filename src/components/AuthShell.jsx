import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

const highlights = [
  'Verified listings across Chennai, Coimbatore, Madurai, Salem, Trichy, and more',
  'Role-based workflows for customers, brokers, and admins',
  'Production Supabase Auth, storage, and broker approval flow',
];

export default function AuthShell({ 
  title, 
  subtitle, 
  children, 
  footer, 
  backTo = '/' 
}) {
  return (
    <div className="grid min-h-screen bg-[#FAF9F6] lg:grid-cols-[.95fr_1.05fr]">
      {/* Left Sidebar - Marketing */}
      <aside className="hidden bg-[#134E4A] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <Link to="/" className="mb-14 inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-[#134E4A]">
              A
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">ALAYAA</div>
              <div className="text-2xl font-extrabold">Real Estate Platform</div>
            </div>
          </Link>

          <h1 className="max-w-lg text-5xl font-extrabold leading-tight">
            Premium property discovery for Tamil Nadu buyers and brokers.
          </h1>

          <p className="mt-5 max-w-lg text-white/75">
            A production-ready rental and sales experience with verified profiles, secure media upload,
            and role-based dashboards.
          </p>

          <ul className="mt-8 space-y-4">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-white/85">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Secure by design</div>
              <div className="text-xs text-white/60">Supabase Auth, RLS, and storage policies</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white">
              <Building2 size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Broker workflow</div>
              <div className="text-xs text-white/60">Approval, listings, enquiries, and analytics</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Premium UI</div>
              <div className="text-xs text-white/60">Modern, calm, and conversion-focused</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Login Form Area */}
      <main className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-lg">
          <Link
            to={backTo}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] transition hover:text-[#0F766E]"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <div className="surface rounded-[28px] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6">
              <p className="section-eyebrow">ALAYAA</p>
              <h1 className="mt-2 text-3xl font-extrabold text-[#1F2937]">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">{subtitle}</p>
            </div>

            {children}

            {footer && <div className="mt-6">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}