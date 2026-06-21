import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const loginByRole = {
  customer: '/login',
  broker: '/broker/login',
  admin: '/admin/login',
}

export default function ProtectedRoute({ allowedRoles, children, loginPath }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] text-[#6B7280]">
        Loading secure session...
      </div>
    )
  }

  if (!user) {
    const inferredLogin = loginPath || (allowedRoles?.length ? loginByRole[allowedRoles[0]] || '/login' : '/login')
    return <Navigate to={inferredLogin} state={{ from: location }} replace />
  }

  const role = user.profile?.role || 'customer'
  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

