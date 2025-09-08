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
GOOGLE_CLIENT_ID=REPLACE_WITH_YOUR_ACTUAL_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=REPLACE_WITH_YOUR_ACTUAL_GOOGLE_CLIENT_SECRET

# JWT Secret (REQUIRED - Generate a secure random string)
JWT_SECRET=REPLACE_WITH_YOUR_ACTUAL_JWT_SECRET

# Session Secret (REQUIRED - Generate a secure random string)
SESSION_SECRET=REPLACE_WITH_YOUR_ACTUAL_SESSION_SECRET

# Organizer Emails (Optional - comma-separated list of emails with organizer privileges)
ORGANIZER_EMAILS=test@gmail.com,organizer@college.edu,admin@college.edu
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
