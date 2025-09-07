const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
  // Read the current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update the MongoDB URI
  envContent = envContent.replace(
    /MONGODB_URI=.*/,
    'MONGODB_URI=mongodb+srv://snehauppula:chikki%4023@cluster0.pjx9z9q.mongodb.net/collegehub'
  );
  
  // Write the updated content back
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ MongoDB connection string updated successfully!');
  console.log('🔗 New connection string: mongodb+srv://snehauppula:chikki%4023@cluster0.pjx9z9q.mongodb.net/collegehub');
  console.log('🚀 You can now restart your server with: npm start');
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
  console.log('\n📝 Please manually update your .env file:');
  console.log('Change this line:');
  console.log('MONGODB_URI=mongodb://localhost:27017/collegehub');
  console.log('To this:');
  console.log('MONGODB_URI=mongodb+srv://snehauppula:chikki%4023@cluster0.pjx9z9q.mongodb.net/collegehub');
}
