const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Create test users (Google OAuth only - no passwords needed)
    const users = [
      {
        googleId: 'google_123456789',
        name: 'Sneha Uppula',
        email: 'snehauppula23@gmail.com',
        isOrganizer: true,
        clubName: 'Tech Club'
      },
      {
        googleId: 'google_987654321',
        name: 'Test Organizer',
        email: 'test@gmail.com',
        isOrganizer: true,
        clubName: 'Test Club'
      },
      {
        googleId: 'google_111222333',
        name: 'John User',
        email: 'john.user@college.edu',
        isOrganizer: false,
        userId: 'USR001'
      },
      {
        googleId: 'google_444555666',
        name: 'Rahul Misala',
        email: 'rahulmeesala416@gmail.com',
        isOrganizer: true,
        clubName: 'Tech Club'
      },
      {
        googleId: 'google_777888999',
        name: 'Pulluri Aravind',
        email: 'pulluriaravind@gmail.com',
        isOrganizer: true,
        clubName: 'Tech Club'
      }
    ];

    // Insert users
    await User.insertMany(users);
    console.log('✅ Added test users to database');
    console.log('\n🎉 Database seeded successfully!');
    console.log('Test users (Google OAuth only):');
    console.log('Organizers:');
    console.log('1. snehauppula23@gmail.com (Tech Club)');
    console.log('2. test@gmail.com (Test Club)');
    console.log('3. rahulmeesala416@gmail.com (Tech Club)');
    console.log('4. pulluriaravind@gmail.com (Tech Club)');
    console.log('Regular Users:');
    console.log('5. john.user@college.edu (ID: USR001)');
    console.log('\nNote: All users must login via Google OAuth');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
