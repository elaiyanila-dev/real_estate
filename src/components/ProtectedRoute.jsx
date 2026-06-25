import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const loginByRole = {
  customer: '/login',
  broker: '/broker/login',
  admin: '/admin/login',
};

export default function ProtectedRoute({ 
  allowedRoles = [], 
  children, 
  loginPath 
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] text-[#6B7280]">
        Loading secure session...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    const redirectPath = loginPath || 
      (allowedRoles.length ? loginByRole[allowedRoles[0]] || '/login' : '/login');
    
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check role authorization
  const userRole = user.profile?.role || user.role || 'customer';

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed → render children
  return children;
}