const express = require('express');
const db = require('../database');
const router = express.Router();

// Route to get all status reports for a single project
router.get('/status-reports/:projectId', async (req, res) => {
    const projectId = req.params.projectId;

    try {
        const [statusReports] = await db.promise().query('SELECT * FROM status_report WHERE project = ?', [projectId]);
        res.json(statusReports);
    } catch (error) {
        console.error('Error fetching status reports:', error);
        res.status(500).send('Error fetching status reports');
    }
});

// Route to add a status report
router.post('/status-reports', async (req, res) => {
    const { date, scope_rag, time_rag, cost_rag, percentage, revised_start, revised_end, project } = req.body;

    try {
        const [result] = await db.promise().query(
            'INSERT INTO status_report (date, scope_rag, time_rag, cost_rag, percentage, revised_start, revised_end, project) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [date, scope_rag, time_rag, cost_rag, percentage, revised_start, revised_end, project]
        );
        res.status(201).json({ statusReportId: result.insertId, message: 'Status report added successfully' });
    } catch (error) {
        console.error('Error adding status report:', error);
        res.status(500).send('Error adding status report');
    }
});

module.exports = router;
