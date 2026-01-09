// ============================================
// FILE: backend/api/wallet.js
// ============================================

const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { formData, publicCardUrl } = req.body;

    const issuerId = '3388000000022195061';
    const classId = 'business_card_01';
    const objectId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const passObject = {
      "id": `${issuerId}.${objectId}`,
      "classId": `${issuerId}.${classId}`,
      "state": "ACTIVE",
      "hexBackgroundColor": formData.themeColor?.replace('#', '') || "1e293b",
      "logo": {
        "sourceUri": {
          "uri": formData.avatarUrl || "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg"
        }
      },
      "cardTitle": {
        "defaultValue": {
          "language": "en-US",
          "value": formData.fullName || "Business Card"
        }
      },
      "header": {
        "defaultValue": {
          "language": "en-US",
          "value": formData.jobTitle || "Professional"
        }
      },
      "subheader": {
        "defaultValue": {
          "language": "en-US",
          "value": formData.companyName || ""
        }
      },
      "textModulesData": [
        {
          "id": "contact",
          "header": "CONTACT",
          "body": `${formData.workEmail || ''}\n${formData.workPhone || ''}`
        }
      ],
      "barcode": {
        "type": "QR_CODE",
        "value": publicCardUrl
      }
    };

    const claims = {
      "iss": "wallet-demo@example.com",
      "aud": "google",
      "typ": "savetowallet",
      "iat": Math.floor(Date.now() / 1000),
      "origins": ["*"],
      "payload": {
        "genericObjects": [passObject]
      }
    };

    const header = { alg: 'none', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(claims)).toString('base64url');
    const token = `${encodedHeader}.${encodedPayload}.`;

    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    res.status(200).json({ success: true, saveUrl });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}