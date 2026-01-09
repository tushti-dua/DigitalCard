// ============================================
// FILE: src/App.jsx (FIXED - Privacy Navigation)
// ============================================
import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import { initialFormData } from "./data";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Import Components
import LandingPage from "./Components/LandingPage";
import SignUpView from "./Components/SignUpView";
import LoginView from "./Components/LoginView";
import OnboardingView from "./Components/OnboardingView";
import ProfileView from "./Components/ProfileView";
import PrivacyNoticeView from "./Components/PrivacyNoticeView";
import ThemeToggle from "./Components/ThemeToggle";
import Footer from "./Components/Footer";
import PortalDashboard from "./Components/PortalDashboard";
import PublicCardView from "./Components/PublicCardView";

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'dark');
  const [formData, setFormData] = useState({ ...initialFormData, themeColor: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [currentCardSlug, setCurrentCardSlug] = useState(null);

  // Theme Logic
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // URL Management
  const updateURL = useCallback((path) => {
    window.history.pushState({}, '', path);
  }, []);

  // Firestore Sync (with offline support)
  const syncWithFirestore = useCallback(async (user) => {
    try {
      console.log('🔄 Background Firestore sync...');
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData(prev => ({ ...prev, ...userData }));
        if (userData.avatarUrl) setAvatarPreview(userData.avatarUrl);
        if (userData.bannerUrl) setBannerPreview(userData.bannerUrl);
        if (userData.cardSlug) setCurrentCardSlug(userData.cardSlug);
        
        localStorage.setItem(`profile_${user.uid}`, JSON.stringify(userData));
        console.log('✅ Firestore sync complete');
      }
    } catch (err) {
      if (err.code === 'unavailable' || err.message.includes('offline')) {
        console.log('📡 Offline mode - using local data');
      } else if (err.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        console.log('🚫 Ad blocker detected - using local data');
      } else {
        console.log('❌ Firestore sync failed:', err.message);
      }
    }
  }, []);

  // Load User Data (instant from localStorage)
  const loadUserDataInstantly = useCallback((user) => {
    console.time('⚡ loadUserData');
    
    const localProfile = localStorage.getItem(`profile_${user.uid}`);
    if (localProfile) {
      try {
        const userData = JSON.parse(localProfile);
        setFormData(prev => ({ ...prev, ...userData }));
        if (userData.avatarUrl) setAvatarPreview(userData.avatarUrl);
        if (userData.bannerUrl) setBannerPreview(userData.bannerUrl);
        if (userData.cardSlug) setCurrentCardSlug(userData.cardSlug);
        console.log('✅ Loaded from localStorage');
        console.timeEnd('⚡ loadUserData');
      } catch (err) {
        console.log('❌ Error parsing localStorage', err.message);
      }
    }
    
    // Background sync (non-blocking)
    setTimeout(() => {
      syncWithFirestore(user);
    }, 500);
  }, [syncWithFirestore]);

  // Check URL on initial load (for public cards)
  useEffect(() => {
    const path = window.location.pathname;
    console.log('🔍 Initial path check:', path);
    
    if (path.startsWith('/card/')) {
      const slug = path.replace('/card/', '');
      console.log('🔗 Public card detected:', slug);
      setCurrentCardSlug(slug);
      setCurrentView('public-card');
      setLoading(false);
      setAuthChecked(true);
    }
  }, []);

  // Browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      console.log('⬅️ Navigation event:', path);
      
      if (path.startsWith('/card/')) {
        const slug = path.replace('/card/', '');
        setCurrentCardSlug(slug);
        setCurrentView('public-card');
      } else if (path === '/portal' || path === '/dashboard') {
        if (currentUser) {
          setCurrentView('portal');
        } else {
          setCurrentView('login');
          updateURL('/login');
        }
      } else if (path === '/onboarding') {
        if (currentUser) {
          setCurrentView('onboarding');
        } else {
          setCurrentView('login');
          updateURL('/login');
        }
      } else if (path === '/privacy') {
        setCurrentView('privacy');
      } else if (path === '/login') {
        setCurrentView('login');
      } else if (path === '/signup') {
        setCurrentView('signup');
      } else if (path === '/profile') {
        setCurrentView(currentUser ? 'profile' : 'landing');
      } else if (path === '/') {
        setCurrentView(currentUser && authChecked ? 'profile' : 'landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser, authChecked, updateURL]);

  // Auth State Management
  useEffect(() => {
    // Don't run auth check if already showing public card
    if (currentView === 'public-card') {
      console.log('🔗 Public card view active - skipping auth redirect');
      return;
    }

    console.time('🔐 Auth check');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.timeEnd('🔐 Auth check');
      console.log('👤 User:', user ? user.uid : 'none');
      
      setCurrentUser(user);
      setLoading(false);
      setAuthChecked(true);
      
      if (user) {
        loadUserDataInstantly(user);
        
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_${user.uid}`);
        const path = window.location.pathname;
        
        console.log('📍 Path:', path);
        console.log('✅ Onboarding:', hasCompletedOnboarding ? 'Complete' : 'Pending');
        
        // Don't override if viewing public card
        if (path.startsWith('/card/')) {
          console.log('🔗 Staying on public card view');
          return;
        }
        
        // Routing logic
        if (path === '/signup' || path === '/login') {
          if (hasCompletedOnboarding) {
            console.log('→ Redirecting to profile');
            setCurrentView('profile');
            updateURL('/profile');
          } else {
            console.log('→ Redirecting to onboarding');
            setCurrentView('onboarding');
            updateURL('/onboarding');
          }
        } else if (path === '/portal' || path === '/dashboard') {
          console.log('→ Showing portal');
          setCurrentView('portal');
        } else if (path === '/onboarding') {
          console.log('→ Showing onboarding/edit');
          setCurrentView('onboarding');
        } else if (path === '/privacy') {
          console.log('→ Showing privacy');
          setCurrentView('privacy');
        } else if (path === '/profile') {
          console.log('→ Showing profile');
          setCurrentView('profile');
        } else if (hasCompletedOnboarding && path === '/') {
          console.log('→ Showing profile');
          setCurrentView('profile');
          updateURL('/profile');
        } else if (!hasCompletedOnboarding) {
          console.log('→ Showing onboarding');
          setCurrentView('onboarding');
          updateURL('/onboarding');
        }
      } else {
        // User not logged in
        const path = window.location.pathname;
        
        // Allow public card view without login
        if (path.startsWith('/card/')) {
          console.log('🔗 Public card - no login required');
          return;
        }
        
        // Keep user on signup/login pages
        if (path === '/signup') {
          console.log('→ Staying on signup');
          setCurrentView('signup');
        } else if (path === '/login') {
          console.log('→ Staying on login');
          setCurrentView('login');
        } else {
          console.log('→ Showing landing');
          setCurrentView('landing');
          updateURL('/');
        }
      }
    });

    return () => unsubscribe();
  }, [currentView, loadUserDataInstantly, updateURL]);

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, themeColor: '' }));
    }
  };

  const handleThemeColorSelect = (color) => {
    setFormData(prev => ({ ...prev, themeColor: color }));
    setBannerPreview(null);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (currentUser) {
      console.log('💾 Saving profile...');
      
      // Save locally first
      localStorage.setItem(`onboarding_${currentUser.uid}`, 'completed');
      localStorage.setItem(`profile_${currentUser.uid}`, JSON.stringify(formData));
      
      // Navigate immediately
      setCurrentView('profile');
      updateURL('/profile');
      
      console.log('✅ Profile saved locally, navigating...');
      
      // Save to Firestore in background
      setTimeout(async () => {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(userDocRef, {
            ...formData,
            userId: currentUser.uid,
            email: currentUser.email,
            cardStatus: 'Inactive',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          }, { merge: true });
          console.log('✅ Synced to Firestore');
        } catch (err) {
          console.log('❌ Firestore save failed (data stored locally)', err.message);
        }
      }, 100);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setFormData({ ...initialFormData, themeColor: '' });
      setAvatarPreview(null);
      setBannerPreview(null);
      setCurrentView('landing');
      updateURL('/');
    } catch (err) {
      console.error("Error signing out:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  const navigateToPortal = () => {
    console.log('📍 Navigating to portal...');
    setCurrentView('portal');
    updateURL('/portal');
  };

  // FIXED: Privacy navigation handlers
  const navigateToPrivacy = () => {
    console.log('📍 Navigating to privacy...');
    setCurrentView('privacy');
    updateURL('/privacy');
  };

  const navigateBackToProfile = () => {
    console.log('📍 Navigating back to profile...');
    setCurrentView('profile');
    updateURL('/profile');
  };

  // FIXED: Edit profile navigation handler
  const navigateToEditProfile = () => {
    console.log('📍 Navigating to edit profile...');
    setCurrentView('onboarding');
    updateURL('/onboarding');
  };

  // Loading State
  if (loading && !authChecked) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendering view:', currentView);

  return (
    <div className="min-vh-100 d-flex flex-column position-relative">
      
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <div className="noise-overlay"></div>
      
      {/* Main Content Wrapper */}
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-3 p-md-5 w-100">
        
        {currentView === 'landing' && (
          <LandingPage 
            onGetStarted={() => {
              console.log('🚀 Navigate to signup');
              setCurrentView('signup');
              updateURL('/signup');
            }} 
            onLogin={() => {
              console.log('🔑 Navigate to login');
              setCurrentView('login');
              updateURL('/login');
            }} 
          />
        )}

        {currentView === 'signup' && (
          <SignUpView 
            formData={formData} 
            handleChange={handleChange} 
            onNext={() => setCurrentView('onboarding')} 
            onSwitchToLogin={() => {
              console.log('🔄 Switch to login');
              setCurrentView('login');
              updateURL('/login');
            }}
          />
        )}

        {currentView === 'login' && (
          <LoginView 
            formData={formData} 
            handleChange={handleChange} 
            onLogin={() => {
              console.log('✅ Login successful');
              // Auth state will handle navigation
            }} 
            onSwitchToSignUp={() => {
              console.log('🔄 Switch to signup');
              setCurrentView('signup');
              updateURL('/signup');
            }}
          />
        )}

        {currentView === 'onboarding' && (
          <OnboardingView 
            formData={formData} 
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            avatarPreview={avatarPreview}
            handleBannerUpload={handleBannerUpload}
            handleThemeColorSelect={handleThemeColorSelect}
            bannerPreview={bannerPreview}
            onSubmit={handleProfileSubmit}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView 
            formData={formData}
            avatarPreview={avatarPreview}
            bannerPreview={bannerPreview}
            onEdit={navigateToEditProfile}
            onLogout={handleLogout}
            onPrivacyClick={navigateToPrivacy}
            onPortalClick={navigateToPortal}
            currentUser={currentUser}
          />
        )}

        {currentView === 'portal' && (
          <PortalDashboard 
            currentUser={currentUser}
            formData={formData}
            onEditProfile={navigateToEditProfile}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'privacy' && (
          <PrivacyNoticeView 
            onBack={navigateBackToProfile}
          />
        )}

        {currentView === 'public-card' && currentCardSlug && (
          <PublicCardView cardSlug={currentCardSlug} />
        )}
      </div>

      {/* Footer (only on landing page) */}
      {currentView === 'landing' && <Footer />}

    </div>
  );
};

export default App;