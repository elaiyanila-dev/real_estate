import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home.jsx'
import AdminLogin from './AdminLogin.jsx'
import CustomerLogin from './CustomerLogin.jsx'
import BrokerLogin from './BrokerLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import CustomerDashboard from './CustomerDashboard.jsx'
import BrokerDashboard from './BrokerDashboard.jsx'
import CustomerRegister from './CustomerRegister.jsx'
import BrokerRegister from './BrokerRegister.jsx'
import ForgotPassword from './ForgotPassword.jsx'
import ResetPassword from './ResetPassword.jsx'
import Unauthorized from './Unauthorized.jsx'
import PropertyDetail from './PropertyDetail.jsx'
import { AuthProvider } from '../contexts/AuthContext.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/broker/login" element={<BrokerLogin />} />
          <Route path="/broker/register" element={<BrokerRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/broker/dashboard" element={<ProtectedRoute allowedRoles={['broker']}><BrokerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
