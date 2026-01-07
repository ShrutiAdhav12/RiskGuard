import './styles/globals.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import CustomerDashboard from './components/customer-portal/Dashboard';
import CustomerApplications from './components/customer-portal/ApplicationForm';
import CustomerPolicies from './components/customer-portal/PolicyList';
import CustomerProfile from './components/customer-portal/ProfileSection';
import CustomerSettings from './components/customer-portal/Settings';
import UnderwriterDashboard from './components/underwriter-portal/Dashboard';
import UnderwriterPending from './components/underwriter-portal/ApplicationReview';
import UnderwriterNotifications from './components/underwriter-portal/Notifications';
import UnderwriterSettings from './components/underwriter-portal/Settings';
import AdminDashboard from './components/admin-portal/Dashboard';
import AdminProducts from './components/admin-portal/ProductManagement';
import AdminUsers from './components/admin-portal/UserManagement';
import AdminReports from './components/admin-portal/AnalyticsCharts';
import AdminSettings from './components/admin-portal/Settings';

export const SidebarContext = React.createContext();

function PortalLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex h-screen">
        <Sidebar onToggle={setSidebarOpen} isOpen={sidebarOpen} />
        <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-64 md:ml-64' : 'ml-20'}`}>
          <Navbar />
          <main className="p-8 min-h-screen bg-gray-50 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/customer/dashboard" element={<ProtectedRoute requiredRole="customer"><PortalLayout><CustomerDashboard /></PortalLayout></ProtectedRoute>} />
          <Route path="/customer/applications" element={<ProtectedRoute requiredRole="customer"><PortalLayout><CustomerApplications /></PortalLayout></ProtectedRoute>} />
          <Route path="/customer/policies" element={<ProtectedRoute requiredRole="customer"><PortalLayout><CustomerPolicies /></PortalLayout></ProtectedRoute>} />
          <Route path="/customer/profile" element={<ProtectedRoute requiredRole="customer"><PortalLayout><CustomerProfile /></PortalLayout></ProtectedRoute>} />
          <Route path="/customer/settings" element={<ProtectedRoute requiredRole="customer"><PortalLayout><CustomerSettings /></PortalLayout></ProtectedRoute>} />

          <Route path="/underwriter/dashboard" element={<ProtectedRoute requiredRole="underwriter"><PortalLayout><UnderwriterDashboard /></PortalLayout></ProtectedRoute>} />
          <Route path="/underwriter/pending" element={<ProtectedRoute requiredRole="underwriter"><PortalLayout><UnderwriterPending /></PortalLayout></ProtectedRoute>} />
          <Route path="/underwriter/notifications" element={<ProtectedRoute requiredRole="underwriter"><PortalLayout><UnderwriterNotifications /></PortalLayout></ProtectedRoute>} />
          <Route path="/underwriter/settings" element={<ProtectedRoute requiredRole="underwriter"><PortalLayout><UnderwriterSettings /></PortalLayout></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><PortalLayout><AdminDashboard /></PortalLayout></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><PortalLayout><AdminProducts /></PortalLayout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><PortalLayout><AdminUsers /></PortalLayout></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><PortalLayout><AdminReports /></PortalLayout></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><PortalLayout><AdminSettings /></PortalLayout></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
