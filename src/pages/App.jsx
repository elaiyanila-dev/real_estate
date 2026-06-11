import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home.jsx'
import AdminLogin from './AdminLogin.jsx'
import CustomerLogin from './CustomerLogin.jsx'
import BrokerLogin from './BrokerLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import CustomerDashboard from './CustomerDashboard.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/broker/login" element={<BrokerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
