const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Load models
const User = require('../models/User');
const Question = require('../models/Question');
const Test = require('../models/Test');
const StudentAnswer = require('../models/StudentAnswer');
const Violation = require('../models/Violation');

// Connect to DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test_portal');
    console.log(`MongoDB Connected for seeding: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

// Import Data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    console.log('Clearing database...');
    await User.deleteMany();
    await Question.deleteMany();
    await Test.deleteMany();
    await StudentAnswer.deleteMany();
    await Violation.deleteMany();
    console.log('Database cleared.');

    // Load Questions from JSON
    const questionsPath = path.join(__dirname, 'questionsSeed.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

    // Insert Questions
    console.log(`Seeding ${questionsData.length} questions...`);
    await Question.insertMany(questionsData);
    console.log('Questions seeded successfully.');

    // Create Default Users
    console.log('Seeding default users...');

    // 1. Admin User
    await User.create({
      name: 'System Admin',
      email: 'admin@portal.com',
      password: 'admin123',
      role: 'admin',
    });

    // 2. Student User
    await User.create({
      name: 'Pradeep S',
      email: 'student@portal.com',
      password: 'student123',
      role: 'student',
    });

    console.log('Default users seeded successfully:');
    console.log(' - Admin: admin@portal.com / adminPassword123');
    console.log(' - Student: student@portal.com / studentPassword123');

    console.log('Database Seeding Completed!');
    process.exit();
  } catch (err) {
    console.error(`Error with seeding data: ${err.message}`);
    process.exit(1);
  }
};

importData();
