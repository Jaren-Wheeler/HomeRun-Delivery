
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
    

module.exports = router;

    