import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/dashboards/CustomerDashboard'
import UnderwriterDashboard from './pages/dashboards/UnderwriterDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/underwriter-dashboard" element={<UnderwriterDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
