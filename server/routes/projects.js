const express = require('express');
const db = require('../database');
const router = express.Router();

router.post('/add', async (req, res) => {
    // Extract project data from the request
    console.log(req.body);
    const {
        name,
        program,
        location,
        complexity,
        project_manager,
        business_owner,
        description,
        status,
        budget_approved,
        phase,
        phase_start,
        phase_end
    } = req.body;

    // SQL INSERT query to add a project to the database
    const query = `
        INSERT INTO project (
            name,
            program,
            location,
            complexity,
            project_manager,
            business_owner,
            description,
            status,
            budget_approved,
            phase,
            phase_start,
            phase_end
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the query
    try {
        const [result] = await db.promise().query(query, [
            name,
            program,
            location,
            complexity,
            project_manager,
            business_owner,
            description,
            status,
            budget_approved,
            phase,
            phase_start,
            phase_end
        ]);
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

router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params; // Extract the project ID from the URL parameter

    try {
        // Replace 'your_projects_table' with the actual name of your projects table in the database
        const query = 'SELECT * FROM project WHERE idproject = ?';
        const [project] = await db.promise().query(query, [projectId]);

        if (project.length > 0) {
            res.json(project[0]); // Send back the project details
        } else {
            res.status(404).send('Project not found');
        }
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Error fetching project details');
    }
});

module.exports = router;
module.exports = router;
