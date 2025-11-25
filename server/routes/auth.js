const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const router = express.Router();

const SECRET_KEY = 'your_secret_key'; // In production, use environment variable

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
        }

        const existingName = await User.findOne({ where: { name } });
        if (existingName) {
            return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso' });
        }

        const user = await User.create({ name, email, password });
        res.json({ success: true, message: 'Usuario registrado', user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email, password } }); // In production, hash passwords!
        if (!user) {
            return res.status(401).json({ token: null, message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload Profile Picture
router.post('/profile/image', upload.single('avatar'), async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findByPk(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const imageUrl = `/uploads/${req.file.filename}`;
        user.profilePicture = imageUrl;
        await user.save();

        res.json({ success: true, imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Profile (Name, Password)
router.put('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findByPk(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, password } = req.body;

        if (name) user.name = name;
        if (password) user.password = password; // In production, hash this!

        await user.save();

        res.json({
            success: true,
            message: 'Perfil actualizado correctamente',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
