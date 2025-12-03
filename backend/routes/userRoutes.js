
const express = require('express');
const router = express.Router();
const User  = require("../models/User");
const bcrypt = require('bcryptjs');


router.post("/", async (req, res) => {
     console.log("Incoming body:", req.body);
    
     try {
        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            role,
        } = req.body
    
        if (!first_name || !last_name || !email || !phone || !password) {
            console.log("Missing required fields");
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        console.log("Creating user with hashed password");
        console.log("Creating user with payload:", {first_name, last_name, email, phone, password, role});
        const newUser = await User.create({
            first_name: first_name,
            last_name: last_name,
            email,
            phone,
            passwordHash,
            role: role || 'User',
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()

        });

        const { passwordHash: _, ...userData } = newUser.toJSON();
        console.log("User created successfully:", userData);
        res.status(201).json(userData);

    } catch (error) {
        console.error("Error creating user:", error);
        
        if(error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ message: "Validation Error", details: messages });
            
        }

        return res.status(400).json({ message: "Server Error"});
    }
});

router.post("/login", async (req, res) => {
    console.log("Incoming login:", req.body);

    try {
        const { email, password } = req.body;

        // Validate incoming fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log("No user found with email:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            console.log("Incorrect password for:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Remove passwordHash before returning user data
        const { passwordHash, ...safeUser } = user.toJSON();

        console.log("Login successful:", safeUser);
        return res.status(200).json({
            message: "Login successful",
            user: safeUser
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;

    