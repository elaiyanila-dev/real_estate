import { Link } from 'react-router-dom'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#0F766E]">Back to Home</Link>
        <div className="surface rounded-3xl p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F766E] text-xl font-extrabold text-white">A</div>
            <p className="section-eyebrow">ALAYAA</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#1F2937]">{title}</h1>
            <p className="mt-2 text-sm text-[#6B7280]">{subtitle}</p>
          </div>
          {children}
          {footer}
        </div>
      </div>
    </div>
  )
}
