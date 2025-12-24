function Footer() {
  let year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {year} RiskGuard. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <span>|</span>
          <a href="#">Terms of Service</a>
          <span>|</span>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
