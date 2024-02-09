const express = require('express');
const multer = require('multer');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const db = require('../database');

// Configure multer for file upload handling
const upload = multer({ dest: 'uploads/' });

// POST route to add a new user
router.post('/register', upload.single('photo'), async (req, res) => {
    console.log("Register Request body: ", req.body);
    console.log("Uploaded file: ", req.file);

    const { name_first, name_second, office, department, user_type, username, password } = req.body;
    const photo = req.file ? req.file.path : '';

    try {
        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Insert the user with the hashed password
        const query = `
            INSERT INTO user (name_first, name_second, office, department, user_type, photo, username, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.promise().query(query, [name_first, name_second, office, department, user_type, photo, username, hashedPassword]);

        res.status(201).json({ message: 'New user added successfully' });
    } catch (err) {
        console.error('Error adding new user:', err);
        res.status(500).send('Error adding new user');
    }
});

// POST route for user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Login Request body: ", req.body);

    try {
        const sql = 'SELECT * FROM user WHERE username = ?';
        const [users] = await db.promise().query(sql, [username]);
        console.log("Users found: ", users);

        if (users.length > 0) {
            const user = users[0];
            console.log("User found: ", user);
            const passwordMatch = await bcryptjs.compare(password, user.password);
            console.log("Password match: ", passwordMatch);

            if (passwordMatch) {
                res.status(200).json({ message: "Login successful" });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error("Error during login: ", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET route to fetch all users
router.get('/getall', async (req, res) => {
    try {
        // Include iduser in the SELECT statement
        const sql = 'SELECT iduser, name_first, name_second, office, department, user_type FROM user';
        const [users] = await db.promise().query(sql);
        res.json(users);
    } catch (err) {
        console.error("Error fetching users: ", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});


// PUT route to update an existing user
router.put('/update/:iduser', async (req, res) => {
    const { iduser } = req.params;
    const { name_first, name_second, office, department, user_type, photo } = req.body;

    if (!iduser) {
        return res.status(400).send('User ID is required');
    }

    try {
        const query = `
            UPDATE user
            SET
                name_first = ?,
                name_second = ?,
                office = ?,
                department = ?,
                user_type = ?,
                photo = ?
            WHERE iduser = ?
        `;
        await db.promise().query(query, [name_first, name_second, office, department, user_type, photo, iduser]);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Error updating user');
    }
});

// DELETE route to delete a user
router.delete('/delete/:iduser', async (req, res) => {
    const { iduser } = req.params;
    try {
        const query = `DELETE FROM user WHERE iduser = ?`;
        await db.promise().query(query, [iduser]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});


module.exports = router;