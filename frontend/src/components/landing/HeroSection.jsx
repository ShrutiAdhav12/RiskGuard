import { useNavigate } from 'react-router-dom'

function HeroSection() {
  let navigate = useNavigate()

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h2 className="hero-title">
            Comprehensive Insurance Risk Assessment
          </h2>
          <p className="hero-text">
            RiskGuard provides advanced risk assessment and underwriting solutions 
            for modern insurance organizations. Our platform helps evaluate, manage, 
            and mitigate risks effectively.
          </p>
          <button
            className="btn btn-primary hero-button"
            onClick={() => navigate('/register')}
          >
            Get Started Today
          </button>
        </div>
        
        <div className="stats-box">
          <div className="stat-item">
            <h3>10K+</h3>
            <p>Policies Processed</p>
          </div>
          <div className="stat-item">
            <h3>99.8%</h3>
            <p>Accuracy Rate</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
