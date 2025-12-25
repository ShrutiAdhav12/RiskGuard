import { useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import usersData from '../../data/users.json'

function AdminDashboard() {
  // State: track which role is selected for filtering
  let [selectedRole, setSelectedRole] = useState(null)
  
  // Combine all users from JSON data
  let allUsers = []
  for (let i = 0; i < usersData.customers.length; i++) {
    allUsers.push(usersData.customers[i])
  }
  for (let i = 0; i < usersData.underwriters.length; i++) {
    allUsers.push(usersData.underwriters[i])
  }
  for (let i = 0; i < usersData.admins.length; i++) {
    allUsers.push(usersData.admins[i])
  }

  // Toggle filter - show customers or show all
  function handleUserManagement() {
    if (selectedRole === null) {
      setSelectedRole('customer')
    } else {
      setSelectedRole(null)
    }
  }

  // Filter users based on selected role
  let displayedUsers = []
  if (selectedRole !== null) {
    // Only show users with the selected role
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].role === selectedRole) {
        displayedUsers.push(allUsers[i])
      }
    }
  } else {
    // Show all users
    for (let i = 0; i < allUsers.length; i++) {
      displayedUsers.push(allUsers[i])
    }
  }
  
  // Count each role type
  let totalUsers = allUsers.length
  let customers = usersData.customers.length
  let underwriters = usersData.underwriters.length
  let admins = usersData.admins.length

  // Get the CSS class name for user role
  function getRoleClass(role) {
    if (role === 'customer') {
      return 'customer'
    } else if (role === 'underwriter') {
      return 'underwriter'
    } else {
      return 'admin'
    }
  }
  return (
    <>
      <Header />
      <div className="page-container">
        <div className="container">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System management and analytics</p>

          <div className="grid grid-4">
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-blue">▦</div>
              <div>
                <h3 className="stat-number">1,245</h3>
                <p className="stat-label">Total Applications</p>
              </div>
            </div>
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-green">▲</div>
              <div>
                <h3 className="stat-number">92%</h3>
                <p className="stat-label">Approval Rate</p>
              </div>
            </div>
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-amber">⚖</div>
              <div>
                <h3 className="stat-number">6.2</h3>
                <p className="stat-label">Avg Risk Score</p>
              </div>
            </div>
            <div className="stat-card stat-card-glass">
              <div className="stat-icon-red">◉</div>
              <div>
                <h3 className="stat-number">{totalUsers}</h3>
                <p className="stat-label">Active Users</p>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '2rem'}}>
            <h2 className="section-title">Admin Tools</h2>
            <div className="quick-actions">
              <button className="btn-glass primary" onClick={handleUserManagement}>{selectedRole ? 'Show All Users' : 'Filter by Customers'}</button>
              <button className="btn-glass primary">Product Management</button>
              <button className="btn-glass primary">Analytics & Reports</button>
              <button className="btn-glass primary">System Settings</button>
            </div>
          </div>

          <div className="placeholder-section">
            <h2 className="section-title">User Statistics</h2>
            <div className="user-stats-grid">
              <div className="stat-box stat-box-blue">
                <h3 className="stat-box-number">{customers}</h3>
                <p className="stat-box-label">Customers</p>
              </div>
              <div className="stat-box stat-box-amber">
                <h3 className="stat-box-number">{underwriters}</h3>
                <p className="stat-box-label">Underwriters</p>
              </div>
              <div className="stat-box stat-box-red">
                <h3 className="stat-box-number">{admins}</h3>
                <p className="stat-box-label">Admins</p>
              </div>
            </div>
          </div>

          {selectedRole && (
            <div className="info-message">✓ Showing {selectedRole}s only ({displayedUsers.length})</div>
          )}

          <div className="placeholder-section">
            <h2 className="section-title">System Users ({displayedUsers.length})</h2>
            <div style={{marginTop: '1rem'}}>
              {displayedUsers.map(function(user) {
                let roleClass = getRoleClass(user.role)
                
                return (
                  <div key={user.id} className="user-list-item">
                    <div className="user-info">
                      <h3 className="user-name">{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <span className={`role-badge-glass ${roleClass}`}>{user.role}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AdminDashboard
