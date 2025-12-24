import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

function Register() {
  let navigate = useNavigate()
  
  let [fullName, setFullName] = useState('')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [error, setError] = useState('')
  let [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    // Simple validation
    if (!fullName || !email || !password) {
      setError('All fields are required')
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
    
    // Simulate registration
    setLoading(true)
    setTimeout(() => {
      navigate('/login')
      setLoading(false)
    }, 500)
  }

  return (
    <>
      <Header />
      <div className="form-container">
        <div className="form-box">
          <h1 className="form-title">Create Your Account</h1>
          <p className="form-subtitle">Register as a customer to get started</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

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
                placeholder="Create a strong password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{width: '100%'}}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p style={{textAlign: 'center', marginTop: '1.5rem', color: '#666'}}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontWeight: '600'}}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Register
