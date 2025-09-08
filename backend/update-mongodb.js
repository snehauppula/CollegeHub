const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
  // Read the current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update the MongoDB URI - use environment variable or prompt user
  const newMongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/collegehub';
  
  envContent = envContent.replace(
    /MONGODB_URI=.*/,
    `MONGODB_URI=${newMongoUri}`
  );
  
  // Write the updated content back
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ MongoDB connection string updated successfully!');
  console.log('🔗 New connection string:', newMongoUri);
  console.log('🚀 You can now restart your server with: npm start');
  console.log('⚠️  Note: Make sure to set MONGODB_URI environment variable for production!');
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
  console.log('\n📝 Please manually update your .env file:');
  console.log('Set MONGODB_URI to your MongoDB connection string');
  console.log('Example: MONGODB_URI=mongodb://localhost:27017/collegehub');
  console.log('For production: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collegehub');
}
