const express = require('express');
const multer = require('multer');
const db = require('../database');
const router = express.Router();

// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/add', upload.single('photo'), async (req, res) => {
    // Extract resource data from the request
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    const {
        resourceFirstName: name_first,
        resourceSecondName: name_second,
        nativeTranslation: name_native,
        resourceOffice: office,
        resourceDepartment: department,
        role,
        type
    } = req.body;
    const photo = req.file ? req.file.path : ''; // If a photo is uploaded, use its path

    // Your SQL INSERT query to add a resource to the database
    const query = `
        INSERT INTO resource (name_first, name_second, name_native, office, department, role, photo, type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Execute the query
    try {
        const [result] = await db.promise().query(query, [name_first, name_second, name_native, office, department, role, photo, type]);
        res.status(201).json({ idresource: result.insertId, message: 'Resource created successfully' });
    } catch (err) {
        console.error('Error adding new resource:', err);
        res.status(500).send('Error adding new resource');
    }
});

// GET route to fetch all resources
router.get('/getall', async (req, res) => {
    try {
        const [results, fields] = await db.promise().query('SELECT * FROM resource');
        res.json(results);
    } catch (err) {
        console.error("Error fetching resources: ", err);
        res.status(500).json({ message: "Error fetching resources" });
    }
});

// PUT route to update an existing resource
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name_first, name_second, name_native, office, department, role, type } = req.body;
    const photo = req.file ? req.file.path : ''; // Adjust based on how you handle file uploads

    try {
        const query = `
            UPDATE resource
            SET name_first = ?, 
                name_second = ?, 
                name_native = ?, 
                office = ?, 
                department = ?, 
                role = ?, 
                type = ?, 
                photo = ?
            WHERE idresource = ?
        `;
        await db.promise().query(query, [name_first, name_second, name_native, office, department, role, type, photo, id]);
        res.json({ message: 'Resource updated successfully' });
    } catch (err) {
        console.error('Error updating resource:', err);
        res.status(500).send('Error updating resource');
    }
});


// DELETE route to delete a resource
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM resource WHERE idresource = ?';
        await db.promise().query(query, [id]);
        res.json({ message: 'Resource deleted successfully' });
    } catch (err) {
        console.error('Error deleting resource:', err);
        res.status(500).send('Error deleting resource');
    }
});


module.exports = router;
