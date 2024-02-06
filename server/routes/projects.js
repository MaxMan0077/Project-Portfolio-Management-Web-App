const express = require('express');
const db = require('../database');
const router = express.Router();

router.post('/add', async (req, res) => {
    // Extract project data from the request
    const {
        name,
        program,
        location,
        complexity,
        project_manager,
        business_owner,
        description,
        status,
        budget_approved
    } = req.body;

    // Your SQL INSERT query to add a project to the database
    const query = `
        INSERT INTO project (name, program, location, complexity, project_manager, business_owner, description, status, budget_approved)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the query
    try {
        const [result] = await db.promise().query(query, [name, program, location, complexity, project_manager, business_owner, description, status, budget_approved]);
        res.status(201).json({ projectId: result.insertId, message: 'Project created successfully' });
    } catch (err) {
        console.error('Error adding new project:', err);
        res.status(500).send('Error adding new project');
    }
});

module.exports = router;
