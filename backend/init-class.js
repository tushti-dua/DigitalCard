// ============================================
// FILE: backend/init-class.js
// Initialize Google Wallet class
// ============================================

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/init-class',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('🔄 Initializing Google Wallet class...');
console.log('📡 Connecting to: http://localhost:3001/api/init-class\n');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ SUCCESS!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Class ID:', result.classId);
        console.log('Message:', result.message);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🎉 Your Google Wallet class is ready!');
        console.log('You can now test creating wallet passes.\n');
        process.exit(0);
      } else {
        console.error('❌ FAILED!');
        console.error('Error:', result.error);
        if (result.details && result.details.length > 0) {
          console.error('Details:', result.details);
        }
        process.exit(1);
      }
    } catch (e) {
      console.error('❌ Failed to parse response');
      console.log('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection Error!');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('Message:', error.message);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n⚠️  Make sure the backend server is running!');
  console.log('Run in another terminal: npm run dev:backend\n');
  process.exit(1);
});

req.end();