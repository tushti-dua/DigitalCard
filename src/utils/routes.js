// ============================================
// FILE: src/utils/walletIntegration/googleWallet.js
// FIXED - Removed double /api prefix
// ============================================

// ✅ FIXED: Use import.meta.env for Vite or fallback to window
const BACKEND_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WALLET_BACKEND_URL) ||
  (typeof window !== 'undefined' && window._env_?.REACT_APP_WALLET_BACKEND_URL) ||
  'http://localhost:3001';

/**
 * Google Wallet Integration - Production Ready
 * Connects to your backend to create real Google Wallet passes
 */

export const addToGoogleWallet = async (formData, publicCardUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!publicCardUrl) {
        reject(new Error('Card must be published first'));
        return;
      }

      console.log('📱 Creating Google Wallet pass...');

      // Prepare card data
      const cardData = {
        userId: formData.userId || Date.now().toString(),
        fullName: formData.fullName,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        workEmail: formData.workEmail,
        workPhone: formData.workPhone,
        website: formData.website,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        themeColor: formData.themeColor || '#1e293b',
        avatarUrl: formData.avatarUrl,
        bannerUrl: formData.bannerUrl,
        publicCardUrl: publicCardUrl
      };

      // Call backend API - FIXED: Remove /api prefix (it's already in BACKEND_URL)
      const response = await fetch(`${BACKEND_URL}/create-wallet-pass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create wallet pass');
      }

      if (result.success && result.saveUrl) {
        // Open Google Wallet save page
        console.log('✅ Wallet pass created! Opening Google Wallet...');
        
        // Open in new tab/window
        const walletWindow = window.open(result.saveUrl, '_blank');
        
        if (!walletWindow) {
          // Popup blocked, redirect current window
          window.location.href = result.saveUrl;
        }

        setTimeout(() => {
          resolve({
            success: true,
            message: `✅ GOOGLE WALLET PASS CREATED!

🎉 Your digital business card is ready!

WHAT JUST HAPPENED:
• A new window opened to Google Wallet
• Click "Save" to add to your wallet
• Your card will sync across all devices

FEATURES:
✓ Appears in Google Wallet app
✓ Syncs automatically across devices
✓ Updates in real-time when you edit
✓ Accessible offline
✓ Shareable via NFC (tap phones)
✓ QR code for quick sharing

ON YOUR PHONE:
1. Open Google Wallet app
2. Your card should appear automatically
3. Tap to view full details
4. Share via NFC or QR code

💡 TIP: You can also access it from:
   pay.google.com → Passes

Object ID: ${result.objectId}`,
            saveUrl: result.saveUrl,
            objectId: result.objectId
          });
        }, 1000);

      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('❌ Error creating Google Wallet pass:', error);
      
      // User-friendly error messages
      let errorMessage = error.message;
      
      if (error.message.includes('fetch')) {
        errorMessage = `Cannot connect to backend server. 

⚠️ BACKEND NOT RUNNING

Please make sure:
1. Backend server is running (npm start in backend folder)
2. Backend URL is correct: ${BACKEND_URL}
3. CORS is enabled for your domain

Current backend URL: ${BACKEND_URL}

To fix:
• Check backend logs
• Verify .env configuration
• Ensure service account credentials are loaded`;
      } else if (error.message.includes('404')) {
        errorMessage = 'API endpoint not found. Check backend URL configuration.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Authentication error. Check service account credentials.';
      } else if (error.message.includes('Invalid JWT')) {
        errorMessage = 'JWT signing error. Verify service account key file.';
      }
      
      reject(new Error(errorMessage));
    }
  });
};

/**
 * Update existing wallet pass
 * Call this when user updates their card info
 */
export const updateGoogleWalletPass = async (formData, publicCardUrl) => {
  try {
    const cardData = {
      userId: formData.userId,
      fullName: formData.fullName,
      jobTitle: formData.jobTitle,
      companyName: formData.companyName,
      workEmail: formData.workEmail,
      workPhone: formData.workPhone,
      website: formData.website,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      themeColor: formData.themeColor,
      avatarUrl: formData.avatarUrl,
      bannerUrl: formData.bannerUrl,
      publicCardUrl: publicCardUrl
    };

    // FIXED: Remove /api prefix
    const response = await fetch(`${BACKEND_URL}/update-wallet-pass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return {
      success: true,
      message: '✅ Wallet pass updated! Changes will sync automatically.'
    };

  } catch (error) {
    console.error('Error updating wallet pass:', error);
    throw error;
  }
};

/**
 * Check if backend is reachable
 */
export const checkBackendStatus = async () => {
  try {
    // FIXED: Keep this as root / since BACKEND_URL already has /api
    const response = await fetch(`${BACKEND_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        online: true,
        status: data.status,
        message: data.message
      };
    } else {
      return {
        online: false,
        error: 'Backend returned error status'
      };
    }
  } catch (err) {
    return {
      online: false,
      error: err.message
    };
  }
};

// Export backend URL for debugging
export { BACKEND_URL };