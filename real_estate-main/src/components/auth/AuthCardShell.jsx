import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthCardShell({
  backTo = '/',
  title,
  subtitle,
  eyebrow = 'ALAYAA',
  icon,
  children,
}) {
  return (
    <div className="auth-page">
      <div className="w-full max-w-md">
        <Link
          to={backTo}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] transition-colors duration-200 hover:text-[#0F766E]"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <section className="auth-surface rounded-3xl p-8" aria-label={title}>
          <header className="mb-7 text-center">
            <div className="auth-badge mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm">
              {icon}
            </div>
            <p className="section-eyebrow">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#1F2937]">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-[#6B7280]">{subtitle}</p> : null}
          </header>
          {children}
        </section>
      </div>
    </div>
  );
}

