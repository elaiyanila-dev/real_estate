import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4">
      <div className="surface w-full max-w-lg rounded-[28px] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <ShieldAlert size={30} />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1F2937]">Access denied</h1>
        <p className="mt-3 text-sm text-[#6B7280]">
          Your account does not have permission to view this page. Please use the correct role login or contact an administrator.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-secondary rounded-2xl px-5 py-3 font-bold">Home</Link>
          <Link to="/login" className="btn-primary rounded-2xl px-5 py-3 font-bold">Customer Login</Link>
        </div>
      </div>
    </div>
  )
}

