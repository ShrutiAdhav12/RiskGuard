import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Header() {
  let navigate = useNavigate()
  let auth = useAuth()
  
  function handleLogout() {
    auth.logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-logo">
          <h1>RiskGuard</h1>
          <p>Insurance Risk Assessment</p>
        </div>
        
        <nav className="header-nav">
          {!auth.isLoggedIn ? (
            <>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span className="user-email">{auth.user.email}</span>
              <button 
                className="btn btn-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
