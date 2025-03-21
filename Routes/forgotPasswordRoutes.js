import express from "express";
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
const router = express.Router();

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password
    },
});

const sendResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: error.message };
    }
};

// Forgot Password Endpoint
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    // Mock user existence check (replace with actual DB logic)
    const userExists = true; // Replace this with a database query

    if (!userExists) {
        return res.status(404).json({ message: "Email not found" });
    }

    const resetLink = `http://localhost:2000/reset-password?email=${email}`; // Replace with your frontend reset link
    const result = await sendResetEmail(email, resetLink);

    if (result.success) {
        return res.status(200).json({ message: "Password reset link sent to your email!" });
    } else {
        return res.status(500).json({ message: "Failed to send email. Please try again later." });
    }
});

export default router;
