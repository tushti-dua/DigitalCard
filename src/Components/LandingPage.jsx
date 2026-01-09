import React, { useState, useRef } from 'react';
import { Icons } from './Icons'; 

// --- MOCK DATA ---
const MOCK_REVIEWS = [
  { id: 1, text: "Best creative partner we have worked with today!", stars: 5, img: "https://i.pravatar.cc/150?img=1" },
  { id: 2, text: "They understand pacing better than any team!!", stars: 5, img: "https://i.pravatar.cc/150?img=5" },
  { id: 3, text: "Their edits doubled our watch time in weeks flat!!", stars: 5, img: "https://i.pravatar.cc/150?img=3" },
  { id: 4, text: "Seamless transition to digital cards. Highly recommend!", stars: 5, img: "https://i.pravatar.cc/150?img=8" },
];

const LandingPage = ({ onGetStarted, onLogin }) => {
  const [email, setEmail] = useState('');
  const [isMuted, setIsMuted] = useState(true); 
  const videoRef = useRef(null); 

  const reviews = MOCK_REVIEWS; 

  // Toggle Audio
  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="landing-container fade-up position-relative d-flex flex-column" style={{minHeight: '100vh'}}>

      {/* --- HERO SECTION WRAPPER --- */}
      <div className="hero-wrapper d-flex flex-column justify-content-center" style={{minHeight: '90vh'}}>
        <div className="position-absolute top-0 end-0 mt-4 me-4 d-none d-lg-block" style={{ zIndex: 10 }}>
          <button onClick={onLogin} className="btn-login-ghost">LOGIN</button>
        </div>
        <div className="d-lg-none text-start p-3">
           <button onClick={onLogin} className="btn-login-ghost">LOGIN</button>
        </div>

        <div className="row align-items-center flex-grow-1">
          <div className="col-lg-6 py-4 pe-lg-5 text-center text-lg-start">
            <h1 className="landing-title mb-3">
              Your Business Card,

              <span className="position-relative d-inline-block text-nowrap">
                Reimagined
                <svg className="brush-stroke" viewBox="0 0 200 9" preserveAspectRatio="none">
                  <path d="M2.00025 7.00001C35.9189 4.38722 136.632 -1.45829 198.001 2.00001" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <div className="d-block d-lg-none my-4">
              <img src="/assets/landing-image.png" alt="Hero" className="img-fluid rounded-4 shadow-lg" style={{ maxHeight: '300px' }} />
            </div>

            <p className="landing-description lead mt-3 mb-4">
              Never run out of business cards again. Share your professional details instantly with a tap or scan—no printing, no waste, always up-to-date.
            </p>

            <div className="features-list mb-5">
              <span>Instant Sharing</span> • <span>Always Updated</span> • <span>Eco-Friendly</span> • <span>Mobile-Ready</span>
            </div>

            <div className="email-pill-wrapper mx-auto mx-lg-0">
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input type="email" className="email-input-field" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button onClick={() => onGetStarted(email)} className="btn-pill-action">Get Started</button>
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block text-end position-relative">
            <div className="image-glow"></div> 
            <img src="/assets/landing-image.png" alt="Hero" className="img-fluid rounded-5 shadow-lg position-relative" style={{ maxHeight: '500px', width: 'auto', maxWidth: '100%', zIndex: 2 }} />
          </div>
        </div>
      </div>

      {/* --- REVIEWS SCROLLING SECTION --- */}
      <div className="reviews-section py-5 mt-4 border-top border-light-subtle">
        {reviews.length > 0 ? (
          <div className="marquee-container">
            <div className="marquee-track">
              {[...reviews, ...reviews, ...reviews].map((review, index) => (
                // ⬇️ UPDATED CLASS HERE: added 'rating-glass-card'
                <div key={index} className="review-card rating-glass-card">
                  <div className="d-flex align-items-center mb-2">
                    <img src={review.img} alt="User" className="review-avatar" />
                    <div className="ms-2 text-warning">{'★'.repeat(review.stars)}</div>
                  </div>
                  <p className="review-text m-0">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted py-3">
            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">No Reviews Yet</span>
          </div>
        )}
      </div>

      {/* --- USER SUCCESS SECTION --- */}
      <div className="success-section py-5 my-5">
        <div className="container-fluid px-0">
          <div className="text-center mb-5 pb-3">
             <h2 className="display-5 fw-bold section-title">
               Digital cards that work seamlessly 
 across wallets
             </h2>
          </div>

          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="video-card-wrapper position-relative">
                 <video 
                   ref={videoRef}
                   src="/assets/Customer Review.mp4" 
                   className="w-100 rounded-5 shadow-lg video-player"
                   autoPlay 
                   muted={true} 
                   loop 
                   playsInline
                 >
                   Your browser does not support the video tag.
                 </video>
                 <button onClick={toggleAudio} className="btn-mute-overlay" title={isMuted ? "Unmute" : "Mute"}>
                   {isMuted ? (
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                   ) : (
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                   )}
                 </button>
              </div>
            </div>

            <div className="col-lg-6 ps-lg-5">
               <div className="success-content-box">
                  <h6 className="section-label mb-3">USER SUCCESS</h6>
                  <h3 className="success-headline mb-4">
                    Using one digital card across <span className="text-highlight">every wallet</span>
                  </h3>
                  <p className="success-description mb-5">
                    A seamless digital card experience designed to work effortlessly with Apple Wallet, Google Wallet, and Samsung Wallet. Users can save, access, and use their digital cards instantly—without apps, delays, or complexity.
                  </p>
                  <div className="row g-4">
                    <div className="col-6">
                       <h2 className="stat-number">+90%</h2>
                       <p className="stat-label">Faster access to
digital cards</p>
                    </div>
                    <div className="col-6">
                       <h2 className="stat-number">100%</h2>
                       <p className="stat-label">Wallet
compatibility</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PROCESS SECTION --- */}
      <div className="process-section py-5 my-5">
        <div className="container-fluid px-0">

          <div className="text-center mb-5 pb-4">
            <h6 className="section-label mb-3">PROCESS</h6>
            <h2 className="display-5 fw-bold section-title">
              How we turn your card into 
 a digital experience
            </h2>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="process-card">
                <div className="process-img-wrapper mb-4">
                  <img src="/assets/card 1.jpg" alt="Create Card" className="img-fluid rounded-4 shadow-sm" />
                </div>
                <h4 className="process-card-title mb-3">Create your digital card</h4>
                <p className="process-card-text">
                  Enter your card details once and set up your digital card in minutes. No apps, no complexity—just a simple, guided setup.
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="process-card">
                <div className="process-img-wrapper mb-4">
                  <img src="/assets/card 2.jpg" alt="Wallet Ready" className="img-fluid rounded-4 shadow-sm" />
                </div>
                <h4 className="process-card-title mb-3">We make it wallet-ready</h4>
                <p className="process-card-text">
                  We optimize your digital card to work seamlessly with Apple Wallet, Google Wallet, and Samsung Wallet—ensuring compatibility, security, and smooth access.
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="process-card">
                <div className="process-img-wrapper mb-4">
                  <img src="/assets/card 3.jpg" alt="Use Anytime" className="img-fluid rounded-4 shadow-sm" />
                </div>
                <h4 className="process-card-title mb-3">Use it anytime, anywhere</h4>
                <p className="process-card-text">
                  Save your digital card to your wallet and access it instantly whenever you need it—fast, secure, and always available on your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;