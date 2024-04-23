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

router.get('/latestRAGStatus/:projectId', async (req, res) => {
  const projectId = req.params.projectId;

  const query = `
      SELECT sr.scope_rag, sr.time_rag, sr.cost_rag
      FROM status_report sr
      WHERE sr.project = ?
      ORDER BY sr.date DESC
      LIMIT 1;
  `;

  try {
      const [results] = await db.promise().query(query, [projectId]);
      // Send the latest RAG status if exists
      if (results.length > 0) {
          res.json(results[0]);
      } else {
          // Handle case where no status reports exist
          res.status(404).send('No status reports found for project ID ' + projectId);
      }
  } catch (err) {
      console.error('Error fetching latest RAG status:', err);
      res.status(500).send('Error fetching latest RAG status');
  }
});

// Route to delete a status report
router.delete('/delete/:reportId', async (req, res) => {
  const reportId = req.params.reportId;

  try {
      const [result] = await db.promise().query('DELETE FROM status_report WHERE code = ?', [reportId]);
      if (result.affectedRows > 0) {
          res.json({ message: 'Status report deleted successfully' });
      } else {
          res.status(404).send('Status report not found');
      }
  } catch (error) {
      console.error('Error deleting status report:', error);
      res.status(500).send('Error deleting status report');
  }
});

module.exports = router;
