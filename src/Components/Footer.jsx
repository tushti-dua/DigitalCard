import React from 'react';
// Note: No CSS import here because it's in index.css

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* --- Top Section: Grid --- */}
        <div className="footer-grid">

          {/* 1️⃣ Brand & About */}
          <div className="footer-col brand-col">
            <h2 className="footer-logo">DigitalCard</h2>
            <p className="footer-desc">
              A simple and secure way to create and use digital cards across Apple Wallet, Google Wallet, and Samsung Wallet.
            </p>
            <div className="social-links">
              <a href="#" aria-label="LinkedIn" className="social-icon">IN</a>
              <a href="#" aria-label="Twitter" className="social-icon">X</a>
              <a href="#" aria-label="Instagram" className="social-icon">IG</a>
              <a href="#" aria-label="YouTube" className="social-icon">YT</a>
            </div>
          </div>

          {/* 2️⃣ Product */}
          <div className="footer-col">
            <h3>Product</h3>
            <ul>
              <li><a href="#">Create Digital Card</a></li>
              <li><a href="#">Wallet Compatibility</a></li>
              <li><a href="#">Secure Access</a></li>
              <li><a href="#">Instant Setup</a></li>
              <li><a href="#">How It Works</a></li>
            </ul>
          </div>

          {/* 3️⃣ Company */}
          <div className="footer-col">
            <h3>Company</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>

          {/* 5️⃣ Legal */}
          <div className="footer-col">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
            <div className="security-badge">
              <span>🔒</span> Your data is encrypted and securely stored.
            </div>
          </div>
        </div>

        {/* 7️⃣ Newsletter */}
        <div className="footer-newsletter">
          <div className="newsletter-text">
            <h3>Stay Updated</h3>
            <p>Get product updates and feature announcements.</p>
          </div>
          <div className="newsletter-input-group">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

        {/* 8️⃣ Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2026 DigitalCard. All rights reserved.</p>
          <p className="disclaimer">
            Apple Wallet, Google Wallet, and Samsung Wallet are trademarks of their respective owners. 
            This website is not affiliated with or endorsed by them.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;