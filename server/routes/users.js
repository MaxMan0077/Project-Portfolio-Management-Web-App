const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../database'); // Adjust this path as needed

// Configure multer (file upload handling)
const upload = multer({ dest: 'uploads/' }); // Files will be saved in the 'uploads' directory

// POST route to add a new user
router.post('/', upload.single('photo'), (req, res) => { // 'photo' is the field name for the uploaded file
    console.log("Request body: ", req.body); // Log the text fields
    console.log("Uploaded file: ", req.file); // Log the file information

    const { name_first, name_second, office, department, user_type, username, password } = req.body;
    const photo = req.file ? req.file.path : ''; // Use the file path if a file was uploaded

    const query = `
        INSERT INTO user (name_first, name_second, office, department, user_type, photo, username, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [name_first, name_second, office, department, user_type, photo, username, password], (err, result) => {
        if (err) {
            console.error('Error adding new user:', err);
            res.status(500).send('Error adding new user');
        } else {
            res.status(201).json({ iduser: result.insertId, message: 'New user added successfully' });
        }
    });
});

module.exports = router;
