import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../model/User.js'; // Adjust the path to your User model
import connectDB from '../database/db.js'; // Adjust the path to your db.js

// Load environment variables from the .env file
dotenv.config({ path: '../config.env' });

// Ensure the MongoDB URI is loaded from the environment variables
const uri = process.env.MONGO_URL;
if (!uri) {
  console.error("MongoDB URI  is not defined in the environment variables. Please check your .env file.");
  process.exit(1); // Exit if the URI is missing
}

// Connect to the database
const connectToDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if connection fails
  }
};

// Insert user function
const insertUser = async () => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash("Admin@074", 10); // Add password here

    // Create a new user in the database
    const newUser = await User.create({
      email: "admin07074@gmail.com", // Add email here
      password: hashedPassword,
    });

    console.log("User inserted successfully:", newUser);
  } catch (error) {
    console.error("Error inserting user:", error);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
};

// Connect to the database and insert user
const run = async () => {
  await connectToDB(); // Establish DB connection
  await insertUser(); // Insert the user
};

run();
