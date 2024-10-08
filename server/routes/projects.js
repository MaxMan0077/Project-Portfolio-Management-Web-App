const express = require('express');
const db = require('../database');
const router = express.Router();

router.post('/add', async (req, res) => {
    // Log incoming request for debugging
    console.log('Received project data:', req.body);

    // Destructure and validate project data from the request
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

    // Check for required fields - adjust according to your requirements
    if (!name || !program || !location || !complexity || !description || !status || !phase) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // SQL INSERT query to add a project to the database
    const query = `
        INSERT INTO project (
            name, program, location, complexity, project_manager,
            business_owner, description, status, budget_approved,
            phase, phase_start, phase_end
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the query
    try {
        const [result] = await db.promise().query(query, [
            name, program, location, complexity, project_manager,
            business_owner, description, status, budget_approved,
            phase, phase_start, phase_end
        ]);
        res.status(201).json({ projectId: result.insertId, message: 'Project created successfully' });
    } catch (err) {
        console.error('SQL Error adding new project:', err);
        res.status(500).json({ message: 'Error adding new project', error: err.message });
    }
});

// GET route to fetch all projects
router.get('/getall', async (req, res) => {
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

// GET route to fetch all Active Projects
router.get('/getActiveProjects', async (req, res) => {
    const query = `SELECT * FROM project WHERE phase = 'In Implementation'`;

    // Execute the query
    try {
        const [projects] = await db.promise().query(query);
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching active projects:', err);
        res.status(500).send('Error fetching active projects');
    }
});

router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params; // Extract the project ID from the URL parameter

    // Execute the query
    try {
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

router.get('/name/:projectId', async (req, res) => {
    const { projectId } = req.params;

    try {
        const query = 'SELECT name FROM project WHERE idproject = ?';
        const [rows] = await db.promise().query(query, [projectId]);

        if (rows.length > 0) {
            res.json({ projectName: rows[0].name });
        } else {
            res.status(404).send('Project not found');
        }
    } catch (error) {
        console.error('Error fetching project name:', error);
        res.status(500).send('Error fetching project name');
    }
});

// Update project details
router.put('/update/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const updateData = req.body;

    let query = 'UPDATE project SET ';
    let queryParams = [];
    for (let field in updateData) {
        if (updateData[field] !== null && updateData[field] !== undefined) {
            query += `${field} = ?, `;
            queryParams.push(updateData[field]);
        }
    }
    query = query.slice(0, -2);
    query += ' WHERE idproject = ?';
    queryParams.push(projectId);

    try {
        const [result] = await db.promise().query(query, queryParams);
        res.json({ message: 'Project updated successfully', result });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).send('Error updating project');
    }
});

router.put('/updatePhase/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const { phase } = req.body;
  
    const query = `
      UPDATE project SET phase = ? WHERE idproject = ?
    `;
  
    try {
      await db.promise().query(query, [phase, projectId]);
      res.status(200).json({ message: 'Project phase updated successfully' });
    } catch (err) {
      res.status(500).send('Error updating project phase');
    }
});

router.delete('/delete/:projectId', async (req, res) => {
    const { projectId } = req.params;
    
    try {
        const query = 'DELETE FROM project WHERE idproject = ?';
        await db.promise().query(query, [projectId]);

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).send('Error deleting project');
    }
});

module.exports = router;