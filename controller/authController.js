import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js"; // Adjust path to your User model

// Login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },  // Payload
            process.env.JWT_SECRET,               // Secret key from environment variable
            { expiresIn: '1h' }                  // Expiry time (1 hour)
        );

        // Send token to client
        res.status(200).json({ success: true, message: "Logged in successfully", token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// Logout
export const logoutUser = (req, res) => {
    // JWT is stateless, no need to destroy a session or clear cookies
    // Just respond with a success message
    res.status(200).json({ success: true, message: "Logged out successfully" });
};
