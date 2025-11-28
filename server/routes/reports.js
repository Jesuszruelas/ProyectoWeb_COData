const express = require('express');
const jwt = require('jsonwebtoken');
const Report = require('../models/Report');
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

// Get reports (Scoped)
router.get('/', async (req, res) => {
    try {
        let reports;
        // Admin sees all, User sees own
        if (req.user.email === 'admin@cdata.com') {
            reports = await Report.findAll();
        } else {
            reports = await Report.findAll({ where: { userId: req.user.id } });
        }
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create report (Scoped)
router.post('/', async (req, res) => {
    try {
        const reportData = { ...req.body, userId: req.user.id };
        const report = await Report.create(reportData);

        // Notify User
        await Notification.create({
            userId: req.user.id,
            type: 'success',
            title: 'Reporte Creado',
            message: `Tu reporte "${report.title || 'Nuevo Reporte'}" ha sido recibido exitosamente.`
        });

        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update report (Scoped)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const whereClause = { id };

        // Only admin can edit any report, users can only edit their own
        if (req.user.email !== 'admin@cdata.com') {
            whereClause.userId = req.user.id;
        }

        const [updated] = await Report.update(req.body, { where: whereClause });
        if (updated) {
            const updatedReport = await Report.findByPk(id);

            // Notify User (if Admin updated it)
            if (req.user.email === 'admin@cdata.com') {
                await Notification.create({
                    userId: updatedReport.userId,
                    type: 'info',
                    title: 'Reporte Actualizado',
                    message: `El administrador ha actualizado tu reporte "${updatedReport.title || '#' + id}".`
                });
            }

            res.json(updatedReport);
        } else {
            res.status(404).json({ error: 'Report not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete report (Scoped)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByPk(id);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const whereClause = { id };

        // Only admin can delete any report, users can only delete their own
        if (req.user.email !== 'admin@cdata.com') {
            if (report.userId !== req.user.id) {
                return res.status(404).json({ error: 'Unauthorized' });
            }
            whereClause.userId = req.user.id;
        }

        const deleted = await Report.destroy({ where: whereClause });
        if (deleted) {
            // Notify User (if Admin deleted it)
            if (req.user.email === 'admin@cdata.com' && report.userId !== req.user.id) {
                await Notification.create({
                    userId: report.userId,
                    type: 'warning',
                    title: 'Reporte Eliminado',
                    message: `El administrador ha eliminado tu reporte "${report.title || '#' + id}".`
                });
            }

            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Report not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
