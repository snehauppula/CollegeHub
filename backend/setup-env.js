const fs = require('fs');
const path = require('path');

const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/collegehub

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# JWT Secret
JWT_SECRET=collegehub-super-secret-jwt-key-2024

# Session Secret
SESSION_SECRET=collegehub-session-secret-key-2024
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📁 Location:', envPath);
  console.log('🔑 Google OAuth credentials configured');
  console.log('🚀 You can now run: npm start');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Please create the .env file manually with the following content:');
  console.log('─'.repeat(50));
  console.log(envContent);
  console.log('─'.repeat(50));
}
