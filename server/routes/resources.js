const express = require('express');
const multer = require('multer');
const db = require('../database');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Configure multer for file upload handling
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
      // Use the original file name and append the original extension
      callback(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

// Assuming the multer configuration is the same as above and already defined in your file

// POST route to add a new resource
router.post('/add', upload.single('photo'), async (req, res) => {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    // Destructuring and renaming body parameters to match your database schema
    const {
        resourceFirstName: name_first,
        resourceSecondName: name_second,
        nativeTranslation: name_native,
        resourceOffice: office,
        resourceDepartment: department,
        role,
        type
    } = req.body;

    // If a photo is uploaded, use its filename (which includes the original extension)
    const photo = req.file ? req.file.filename : '';

    // Your SQL INSERT query to add a resource to the database
    const query = `
        INSERT INTO resource (name_first, name_second, name_native, office, department, role, photo, type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the query
    try {
        const [result] = await db.promise().query(query, [name_first, name_second, name_native, office, department, role, photo, type]);
        res.status(201).json({ idresource: result.insertId, message: 'Resource created successfully', photo: photo });
    } catch (err) {
        console.error('Error adding new resource:', err);
        res.status(500).send('Error adding new resource');
    }
});

// GET route to fetch all resources
router.get('/getall', async (req, res) => {
    try {
        const [resources] = await db.promise().query('SELECT * FROM resource');

        // Convert photo BLOB to a Base64 string for each resource
        const resourcesWithBase64Photos = resources.map(resource => ({
            ...resource,
            photo: resource.photo ? Buffer.from(resource.photo).toString('base64') : null,
        }));

        res.json(resourcesWithBase64Photos);
    } catch (err) {
        console.error("Error fetching resources: ", err);
        res.status(500).json({ message: "Error fetching resources" });
    }
});

// GET route to fetch and return a resource's photo
router.get('/photo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.promise().query('SELECT photo FROM resource WHERE idresource = ?', [id]);
        if (rows.length > 0 && rows[0].photo) {
            // Decode the Base64-encoded filename
            const filename = Buffer.from(rows[0].photo, 'base64').toString('utf-8');
            const photoPath = path.join(__dirname, '..', 'uploads', filename);

            // Check if the file exists before sending it
            if (fs.existsSync(photoPath)) {
                res.sendFile(photoPath);
            } else {
                // If the file does not exist, send a placeholder or 404 with the ID
                res.status(404).send(`Photo not found for resource ID: ${id}`);
            }
        } else {
            // If no photo found or resource does not exist, send a placeholder or 404 with the ID
            res.status(404).send(`No photo found for resource ID: ${id}`);
        }
    } catch (err) {
        console.error('Error fetching resource photo:', err);
        // Include the ID in the error message sent to the client
        res.status(500).send(`Error fetching resource photo for ID: ${id}`);
    }
});

// PUT route to update an existing resource
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name_first, name_second, name_native, office, department, role, type } = req.body;

    try {
        // Assume db.promise().query() to fetch existing resource, including photo
        const [existingResource] = await db.promise().query('SELECT photo FROM resource WHERE idresource = ?', [id]);
        const currentPhoto = existingResource[0].photo;

        const photo = req.file ? req.file.path : currentPhoto; // Use existing photo if no new file

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
