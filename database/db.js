//const mongoose=require('mongoose')
import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `Connected to MongoDB Database: ${conn.connection.host}`.bgGreen.white
    );
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`.bgRed.white);
    process.exit(1); // Stop the app if MongoDB connection fails
  }
};

export default connectDB;
