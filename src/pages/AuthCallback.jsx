import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient.js'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Processing secure sign in...')

  useEffect(() => {
    let active = true

    const run = async () => {
      try {
        const code = searchParams.get('code')
        const nextPath = searchParams.get('next') || '/login'

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }

        if (!active) return
        setStatus('done')
        setMessage('Authentication completed successfully.')
        window.setTimeout(() => {
          window.location.assign(nextPath)
        }, 250)
      } catch (error) {
        console.error(error)
        if (!active) return
        setStatus('error')
        setMessage(error.message || 'Authentication callback failed.')
      }
    }

    run()
    return () => {
      active = false
    }
  }, [searchParams])

  if (status === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] text-[#6B7280]">
        Redirecting...
      </div>
    )
  }

  if (status === 'error') {
    return <Navigate to="/login" replace state={{ message }} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] text-[#6B7280]">
      {message}
    </div>
  )
}

