const express = require('express');
const multer = require('multer');
const db = require('../database');
const router = express.Router();

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
