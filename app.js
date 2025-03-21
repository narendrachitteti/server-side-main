import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database/db.js';
import tourRoutes from './Routes/tourRoutes.js';
import formRoutes from './Routes/formRoutes.js';
import authRoutes from "./Routes/authRoutes.js";
import forgotPasswordRoutes from "./Routes/forgotPasswordRoutes.js";

const app = express();

dotenv.config({ path: './config.env' });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:2000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connect to MongoDB
connectDB();

// Serve static files from uploads directory
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use(tourRoutes);
app.use('/form', formRoutes); 

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`);
});
