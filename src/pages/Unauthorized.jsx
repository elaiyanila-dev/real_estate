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

