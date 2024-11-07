const jwt = require('jsonwebtoken');
const db = require('../config/db');  // Import the database connection
const dotenv = require('dotenv');

dotenv.config();

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Controller function for user registration
const registerUser = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        // Check if the user already exists
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Insert the new user into the database without hashing the password
        await db.promise().query('INSERT INTO users (name, username, password) VALUES (?, ?, ?)', [name, username, password]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller function for user login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const [users] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the stored password directly
        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = generateToken(user.id);

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller function for protected profile route
const getProfile = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: 'Protected data', userId: decoded.id });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile
};
