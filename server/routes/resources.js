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

module.exports = router;
