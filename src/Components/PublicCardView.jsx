// ============================================
// FILE: src/Components/PublicCardView.jsx
// With Wallet Integration & QR Code
// ============================================
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

// Import wallet integrations
import { 
  addToGoogleWallet, 
  addToAppleWallet, 
  addToSamsungWallet 
} from '../utils/walletIntegration';

const PublicCardView = ({ cardSlug }) => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSticky, setShowSticky] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);
  const [walletMessage, setWalletMessage] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const buttonsSectionRef = useRef(null);

  const publicCardUrl = `${window.location.origin}/card/${cardSlug}`;

  useEffect(() => {
    const currentRef = buttonsSectionRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowSticky(false);
        } else {
          if (entry.boundingClientRect.top > 0) {
            setShowSticky(true);
          } else {
            setShowSticky(false);
          }
        }
      },
      { root: null, threshold: 0.1, rootMargin: "0px" }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    const loadPublicCard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Loading card for slug:', cardSlug);
        
        const slugParts = cardSlug.split('-');
        const possibleUserId = slugParts[slugParts.length - 1];
        
        let userId = null;
        const allStorageKeys = Object.keys(localStorage);
        const profileKeys = allStorageKeys.filter(key => key.startsWith('profile_'));
        
        for (const profileKey of profileKeys) {
          const extractedUserId = profileKey.replace('profile_', '');
          const cardDataKey = `card_data_${extractedUserId}`;
          
          const cardDataStr = localStorage.getItem(cardDataKey);
          if (cardDataStr) {
            try {
              const cardData = JSON.parse(cardDataStr);
              if (cardData.cardSlug === cardSlug) {
                userId = extractedUserId;
                break;
              }
            } catch (e) {
              console.log('Error parsing card data');
            }
          }
        }
        
        if (!userId && possibleUserId && possibleUserId.length >= 6) {
          for (const profileKey of profileKeys) {
            const extractedUserId = profileKey.replace('profile_', '');
            if (extractedUserId.endsWith(possibleUserId) || extractedUserId === possibleUserId) {
              userId = extractedUserId;
              break;
            }
          }
        }
        
        if (!userId) {
          setError('Invalid card URL format');
          setLoading(false);
          return;
        }

        const localProfileKey = `profile_${userId}`;
        const localCardKey = `card_data_${userId}`;
        
        const localProfileData = localStorage.getItem(localProfileKey);
        const localCardData = localStorage.getItem(localCardKey);
        
        if (localProfileData && localCardData) {
          try {
            const profileData = JSON.parse(localProfileData);
            const cardInfo = JSON.parse(localCardData);
            
            if (cardInfo.cardStatus === 'Published' && cardInfo.cardSlug === cardSlug) {
              setCardData(profileData);
              setLoading(false);
              return;
            }
          } catch (parseError) {
            console.error('Error parsing localStorage data');
          }
        }

        try {
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            
            if (data.cardStatus === 'Published' && data.cardSlug === cardSlug) {
              setCardData(data);
              
              localStorage.setItem(localProfileKey, JSON.stringify(data));
              localStorage.setItem(localCardKey, JSON.stringify({
                cardStatus: data.cardStatus,
                cardSlug: data.cardSlug
              }));
              
              setLoading(false);
              return;
            }
          }
        } catch (firestoreError) {
          console.log('Firestore lookup failed');
        }

        try {
          const usersRef = collection(db, 'users');
          const q = query(
            usersRef, 
            where('cardSlug', '==', cardSlug), 
            where('cardStatus', '==', 'Published')
          );
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            setCardData(data);
            
            localStorage.setItem(localProfileKey, JSON.stringify(data));
            localStorage.setItem(localCardKey, JSON.stringify({
              cardStatus: data.cardStatus,
              cardSlug: data.cardSlug
            }));
            
            setLoading(false);
            return;
          }
        } catch (queryError) {
          console.log('Firestore query failed');
        }

        setError('Card not found or not published');
        
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to load card. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (cardSlug) {
      loadPublicCard();
    }
  }, [cardSlug]);

  const getBannerStyle = () => {
    if (cardData?.bannerUrl) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${cardData.bannerUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    if (cardData?.themeColor) {
      return {
        background: `linear-gradient(to bottom, ${cardData.themeColor}dd, ${cardData.themeColor}), #000`
      };
    }
    return {
      background: 'linear-gradient(to bottom, #1e293bdd, #0f172a), #000'
    };
  };

  const downloadVCard = () => {
    if (!cardData) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.fullName || 'Name'}
ORG:${cardData.companyName || ''}
TITLE:${cardData.jobTitle || ''}
TEL;TYPE=WORK:${cardData.workPhone || ''}
EMAIL;TYPE=WORK:${cardData.workEmail || ''}
URL:${cardData.website || ''}
ADR;TYPE=WORK:;;${cardData.address || ''};${cardData.city || ''};${cardData.country || ''}
NOTE:${cardData.aboutMe || ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.fullName || 'contact'}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicCardUrl)}`;
    setQrCodeUrl(qrUrl);
    setShowQRModal(true);
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${cardData.fullName || 'business-card'}-qr.png`;
    link.click();
  };

  // Wallet integration handlers
  const handleGoogleWallet = async () => {
    setIsGeneratingWallet(true);
    
    try {
      const result = await addToGoogleWallet(cardData, publicCardUrl);
      setTimeout(() => {
        setWalletMessage(result.message);
        setShowWalletModal(true);
      }, 500);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsGeneratingWallet(false);
    }
  };

  const handleAppleWallet = async () => {
    setIsGeneratingWallet(true);
    
    try {
      const result = await addToAppleWallet(cardData, publicCardUrl);
      setWalletMessage(result.message);
      setShowWalletModal(true);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsGeneratingWallet(false);
    }
  };

  const handleSamsungWallet = async () => {
    setIsGeneratingWallet(true);
    
    try {
      const result = await addToSamsungWallet(cardData, publicCardUrl);
      setWalletMessage(result.message);
      setShowWalletModal(true);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsGeneratingWallet(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading business card...</p>
        </div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
        <div className="glass-card p-5 text-center" style={{ maxWidth: "500px" }}>
          <div className="mb-4" style={{ fontSize: '4rem' }}>🔍</div>
          <h2 className="fw-bold mb-3">Card Not Found</h2>
          <p className="text-muted mb-4">
            {error || 'This card may not be published or the link is incorrect.'}
          </p>
          <a href="/" className="btn btn-primary px-4 py-2">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card rounded-4 w-100 overflow-hidden position-relative z-1 fade-up" style={{ maxWidth: "900px" }}>
        
        {/* Banner Area */}
        <div className="profile-banner" style={getBannerStyle()}>
          <div className="d-flex justify-content-end align-items-center p-4">
            <a href="/" className="profile-header-btn">
              ← Home
            </a>
          </div>

          <div className="p-5 text-center">
            <div className="mx-auto mb-4 p-1 rounded-circle border border-2 border-light border-opacity-25" style={{width: '130px', height: '130px'}}>
              {cardData.avatarUrl ? 
                <img src={cardData.avatarUrl} alt="Avatar" className="rounded-circle w-100 h-100 object-fit-cover" /> : 
                <div className="w-100 h-100 bg-secondary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center">
                  <Icons.User />
                </div>
              }
            </div>
            <h1 className="fw-bold text-white mb-1">{cardData.fullName || "Your Name"}</h1>
            <p className="text-info mb-3" style={{color: '#64ffda'}}>
              {cardData.jobTitle || "Job Title"} {cardData.companyName && `@ ${cardData.companyName}`}
            </p>
            <p className="bio-text small max-w-md mx-auto mt-3" style={{maxWidth: '600px'}}>
              {cardData.aboutMe || "No bio provided."}
            </p>
          </div>
        </div>

        <div className="row g-0">
          {/* Left Box - Contact Info */}
          <div className="col-md-7 p-5 border-end border-secondary border-opacity-10">
            <h6 className="section-title mb-4">Contact Information</h6>
            
            <div className="info-row d-flex align-items-center gap-3 mb-3">
              <div className="info-icon"><Icons.Phone /></div>
              <div><span className="value-text">{cardData.workPhone || 'N/A'}</span></div>
            </div>

            <div className="info-row d-flex align-items-center gap-3 mb-3">
              <div className="info-icon"><Icons.Mail /></div>
              <div><span className="value-text">{cardData.workEmail || 'N/A'}</span></div>
            </div>

            {cardData.website && (
              <div className="info-row d-flex align-items-center gap-3 mb-3">
                <div className="info-icon"><Icons.Globe /></div>
                <div>
                  <a href={cardData.website} target="_blank" rel="noopener noreferrer" className="value-text text-decoration-none">
                    {cardData.website}
                  </a>
                </div>
              </div>
            )}
            
            <h6 className="section-title mb-4 mt-5">Address</h6>
            <div className="info-row border-0 d-flex gap-3">
              <div className="info-icon"><Icons.MapPin /></div>
              <div>
                <span className="value-text d-block">{cardData.address || 'Street Address'}</span>
                <span className="label-text">
                  {cardData.city || 'City'}, {cardData.country || 'Country'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Box - Socials & Actions */}
          <div className="col-md-5 p-5" style={{background: '#0d1117'}}>
            <h6 className="section-title mb-4">Social Networks</h6>
            <div className="social-grid">
              <a href={cardData.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
                LinkedIn <Icons.ArrowRight />
              </a>
              <a href={cardData.twitter || '#'} target="_blank" rel="noopener noreferrer" className="social-btn twitter">
                X / Twitter <Icons.ArrowRight />
              </a>
              <a href={cardData.whatsapp || '#'} target="_blank" rel="noopener noreferrer" className="social-btn whatsapp">
                WhatsApp <Icons.ArrowRight />
              </a>
              <a href={cardData.facebook || '#'} target="_blank" rel="noopener noreferrer" className="social-btn facebook">
                Facebook <Icons.ArrowRight />
              </a>
            </div>

            {/* Wallet Actions */}
            <h6 className="section-title mb-3 mt-5">Add to Wallet</h6>
            <div className="d-grid gap-2 mb-4">
              <button 
                onClick={handleAppleWallet}
                className="wallet-btn-public apple-wallet"
                disabled={isGeneratingWallet}
              >
                <svg className="wallet-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="flex-grow-1 text-start">Apple Wallet</span>
              </button>
              
              <button 
                onClick={handleGoogleWallet}
                className="wallet-btn-public google-wallet"
                disabled={isGeneratingWallet}
              >
                <svg className="wallet-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.8 10.5c0-.4 0-.8-.1-1.1H12v2.2h5.5c-.2 1.2-1 2.2-2.1 2.9v1.8h3.4c2-1.8 3-4.5 3-5.8z"/>
                  <path d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7C4.4 19.6 7.9 22 12 22z"/>
                  <path d="M6.2 13.6c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.9H2.7C2 8.3 1.6 9.6 1.6 11s.4 2.7 1.1 3.9l3.5-2.7z"/>
                  <path d="M12 5.2c1.5 0 2.9.5 3.9 1.5l2.9-2.9C17.2 2.2 14.8 1 12 1 7.9 1 4.4 3.4 2.7 6.9l3.5 2.7C7 7.1 9.3 5.2 12 5.2z"/>
                </svg>
                <span className="flex-grow-1 text-start">Google Wallet</span>
              </button>
              
              <button 
                onClick={handleSamsungWallet}
                className="wallet-btn-public samsung-wallet"
                disabled={isGeneratingWallet}
              >
                <svg className="wallet-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.5 2c-1.4 0-2.5 1.1-2.5 2.5v15c0 1.4 1.1 2.5 2.5 2.5h13c1.4 0 2.5-1.1 2.5-2.5v-15C21 3.1 19.9 2 18.5 2h-13zm6.5 4c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm0 2c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
                </svg>
                <span className="flex-grow-1 text-start">Samsung Wallet</span>
              </button>
            </div>

            {/* QR Code Button */}
            <button 
              onClick={generateQRCode}
              className="wallet-btn-public qr-btn mb-4"
            >
              <svg className="wallet-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              <span className="flex-grow-1 text-start">Generate QR Code</span>
            </button>

            <div ref={buttonsSectionRef} className="pt-4 border-top border-secondary border-opacity-10">
              <button 
                onClick={downloadVCard}
                className="btn w-100 py-3 fw-bold text-dark d-flex align-items-center justify-content-center gap-2"
                style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px' }}
              >
                <Icons.Check /> ADD TO CONTACTS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Sticky Button */}
      <div className={`mobile-sticky-bar ${showSticky ? 'visible' : ''}`}>
        <button 
          onClick={downloadVCard}
          className="btn w-100 py-3 fw-bold text-dark d-flex align-items-center justify-content-center gap-2"
          style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px' }}
        >
          <Icons.Check /> ADD TO CONTACTS
        </button>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ 
            background: 'rgba(0,0,0,0.8)', 
            zIndex: 9999,
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setShowQRModal(false)}
        >
          <div 
            className="glass-card p-5 text-center" 
            style={{ maxWidth: '400px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-4">📱 QR Code</h4>
            <div className="mb-4 p-3 bg-white rounded-3">
              <img src={qrCodeUrl} alt="QR Code" className="w-100" />
            </div>
            <p className="text-muted small mb-4">Scan to save this card</p>
            <div className="d-flex gap-2">
              <button 
                onClick={downloadQRCode}
                className="btn btn-primary flex-grow-1"
              >
                💾 Download
              </button>
              <button 
                onClick={() => setShowQRModal(false)}
                className="btn btn-secondary flex-grow-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {showWalletModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" 
          style={{ 
            background: 'rgba(0,0,0,0.85)', 
            zIndex: 9999,
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setShowWalletModal(false)}
        >
          <div 
            className="glass-card p-4 p-md-5" 
            style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h4 className="mb-0">📱 Wallet Integration</h4>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="btn-close btn-close-white"
              ></button>
            </div>
            <pre style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              lineHeight: '1.6'
            }}>
              {walletMessage}
            </pre>
            <button 
              onClick={() => setShowWalletModal(false)}
              className="btn btn-primary w-100 mt-3"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <style>{`
        .wallet-btn-public {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px;
          background: rgba(255,255,255,0.05);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .wallet-btn-public:not(:disabled):hover {
          background: rgba(255,255,255,0.1);
          transform: translateX(4px);
        }

        .wallet-btn-public:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .wallet-icon {
          flex-shrink: 0;
        }

        .apple-wallet {
          border-color: rgba(0, 122, 255, 0.4);
        }

        .apple-wallet:hover {
          background: rgba(0, 122, 255, 0.15);
          border-color: rgba(0, 122, 255, 0.6);
        }

        .google-wallet {
          border-color: rgba(66, 133, 244, 0.4);
        }

        .google-wallet:hover {
          background: rgba(66, 133, 244, 0.15);
          border-color: rgba(66, 133, 244, 0.6);
        }

        .samsung-wallet {
          border-color: rgba(20, 122, 255, 0.4);
        }

        .samsung-wallet:hover {
          background: rgba(20, 122, 255, 0.15);
          border-color: rgba(20, 122, 255, 0.6);
        }

        .qr-btn {
          border-color: rgba(45, 212, 191, 0.4);
        }

        .qr-btn:hover {
          background: rgba(45, 212, 191, 0.15);
          border-color: rgba(45, 212, 191, 0.6);
        }
      `}</style>
    </>
  );
};

export default PublicCardView;