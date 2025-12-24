import Header from '../common/Header'
import Footer from '../common/Footer'

function CustomerDashboard() {
  return (
    <>
      <Header />
      <div className="page-container">
        <div className="container">
          <h1 className="page-title">Customer Dashboard</h1>
          <p className="page-subtitle">Manage your policies and applications</p>

          <div className="grid grid-4">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div>
                <h3 className="stat-number">3</h3>
                <p className="stat-label">Active Policies</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div>
                <h3 className="stat-number">1</h3>
                <p className="stat-label">Pending Applications</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div>
                <h3 className="stat-number">₹2,07,500</h3>
                <p className="stat-label">Premium Due</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📄</div>
              <div>
                <h3 className="stat-number">8</h3>
                <p className="stat-label">Documents</p>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '2rem'}}>
            <h2 className="section-title">Quick Actions</h2>
            <div className="grid grid-2">
              <button className="action-btn">View Policies</button>
              <button className="action-btn">New Application</button>
              <button className="action-btn">Pay Premium</button>
              <button className="action-btn">Download Documents</button>
            </div>
          </div>

          <div className="placeholder-section">
            <h2 className="section-title">Recent Activities</h2>
            <p className="placeholder-text">Activity timeline will appear here</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CustomerDashboard
