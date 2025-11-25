const express = require('express');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const router = express.Router();

const SECRET_KEY = 'your_secret_key'; // Same as in auth.js

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

router.use(verifyToken);

// Get notifications for logged-in user
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['date', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({
            where: { id, userId: req.user.id }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();

        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
