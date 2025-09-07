const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Organizer = require('./models/Organizer');
const { ORGANIZER_EMAILS } = require('./config/organizers');
const config = require('./config');

async function migrateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all existing organizers
    const organizers = await Organizer.find({});
    console.log(`📊 Found ${organizers.length} organizers to migrate`);

    // Migrate each organizer to User model
    for (const organizer of organizers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: organizer.email });
      
      if (existingUser) {
        console.log(`⚠️  User with email ${organizer.email} already exists, skipping...`);
        continue;
      }

      // Create new user
      const user = new User({
        email: organizer.email,
        password: organizer.password, // Keep the same hashed password
        name: organizer.clubName + ' Organizer', // Default name
        isOrganizer: true,
        clubName: organizer.clubName,
        createdAt: organizer.createdAt || new Date()
      });

      await user.save();
      console.log(`✅ Migrated organizer: ${organizer.email} (${organizer.clubName})`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('You can now safely remove the old Organizer model if desired.');

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateData();
}

module.exports = migrateData;
