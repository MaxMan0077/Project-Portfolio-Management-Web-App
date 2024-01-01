const express = require('express');
const router = express.Router();
const db = require('../database');

// POST route to add a new user
router.post('/users', (req, res) => {
    // Destructure the user data from the request body
    const { name_first, name_second, office, department, user_type, photo, username, password } = req.body;

    // SQL query to insert a new user into the 'users' table
    const query = `
        INSERT INTO users (name_first, name_second, office, department, user_type, photo, username, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the query with the user data
    db.query(query, [name_first, name_second, office, department, user_type, photo, username, password], (err, result) => {
        if (err) {
            // If an error occurs, log it and send a 500 status code
            console.error('Error adding new user:', err);
            res.status(500).send('Error adding new user');
        } else {
            // If successful, send back a 201 status code with the new user's ID and a success message
            res.status(201).json({ iduser: result.insertId, message: 'New user added successfully' });
        }
    });
});

// Export the router to be used in other parts of the application
module.exports = router;
