import express from 'express';
import { loginUser, logoutUser } from '../controller/authController.js';

const router = express.Router();

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", logoutUser);

export default router;
