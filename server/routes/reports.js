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
router.post('/:projectId', async (req, res) => {
  const projectId = req.params.projectId;
  const { scopeRag, timeRag, costRag, percentage, revisedStart, revisedEnd, date } = req.body;

  const query = `
    INSERT INTO status_report (scope_rag, time_rag, cost_rag, percentage, revised_start, revised_end, date, project)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.promise().query(query, [scopeRag, timeRag, costRag, percentage, revisedStart, revisedEnd, date, projectId]);
    res.status(201).json({ message: 'Status report created successfully', insertId: result.insertId });
  } catch (err) {
    console.error('Error creating status report:', err);
    res.status(500).json({ message: 'Error creating status report', error: err });
  }
});
  

module.exports = router;
