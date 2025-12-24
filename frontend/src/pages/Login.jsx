import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

function Login() {
  let navigate = useNavigate()
  let auth = useAuth()
  
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [role, setRole] = useState('customer')
  let [error, setError] = useState('')
  let [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    // Simple validation
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    
    if (email.indexOf('@') === -1) {
      setError('Invalid email format')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    // Simulate login
    setLoading(true)
    setTimeout(() => {
      auth.login({ email, role })
      navigate('/' + role + '-dashboard')
      setLoading(false)
    }, 500)
  }

  return (
    <>
      <Header />
      <div className="form-container">
        <div className="form-box">
          <h1 className="form-title">Login to RiskGuard</h1>
          <p className="form-subtitle">Access your insurance account</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="form-group">
              <label>Login As</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="underwriter">Underwriter</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{width: '100%'}}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{textAlign: 'center', marginTop: '1.5rem', color: '#666'}}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontWeight: '600'}}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Login
