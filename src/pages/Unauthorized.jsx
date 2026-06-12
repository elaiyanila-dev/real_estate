import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4 py-10">
      <div className="surface w-full max-w-xl rounded-[32px] p-12 text-center">
        <ShieldAlert size={48} className="mx-auto mb-6 text-[#0F766E]" />
        <h1 className="mb-4 text-4xl font-extrabold text-[#1F2937]">Access denied</h1>
        <p className="mb-8 text-sm text-[#6B7280]">You do not have permission to view this page. Please sign in with an account that has the required role.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/login" className="btn-primary rounded-2xl px-6 py-3 text-sm font-bold">Sign in</Link>
          <Link to="/" className="btn-secondary rounded-2xl px-6 py-3 text-sm font-bold">Return home</Link>
        </div>
      </div>
    </div>
  )
}
