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

    // SQL INSERT query to add a project to the database
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

// GET route to fetch all projects
router.get('/getall', async (req, res) => {
    // SQL SELECT query to fetch all projects from the database
    const query = `SELECT * FROM project`;

    // Execute the query
    try {
        const [projects] = await db.promise().query(query);
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).send('Error fetching projects');
    }
});
module.exports = router;
