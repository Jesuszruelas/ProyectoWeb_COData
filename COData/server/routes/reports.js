const express = require('express');
const Report = require('../models/Report');
const router = express.Router();

// Get all reports
router.get('/', async (req, res) => {
    try {
        const reports = await Report.findAll();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create report
router.post('/', async (req, res) => {
    try {
        const report = await Report.create(req.body);
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update report
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Report.update(req.body, { where: { id } });
        if (updated) {
            const updatedReport = await Report.findByPk(id);
            res.json(updatedReport);
        } else {
            res.status(404).json({ error: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete report
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Report.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
