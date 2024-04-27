const express = require('express');
const multer = require('multer');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const db = require('../database');
const path = require('path');

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
  
// POST route to add a new user
router.post('/register', upload.single('photo'), async (req, res) => {
  console.log("Register Request body: ", req.body);
  console.log("Uploaded file: ", req.file);

  const { name_first, name_second, office, department, user_type, username, password } = req.body;
  const photo = req.file ? req.file.filename : ''; // Use the filename which includes the original extension

  try {
    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Insert the user with the hashed password and photo (if provided)
    const query = `
      INSERT INTO user (name_first, name_second, office, department, user_type, photo, username, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.promise().query(query, [name_first, name_second, office, department, user_type, photo, username, hashedPassword]);

    res.status(201).json({ message: 'New user added successfully', photo: photo });
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

        if (users.length > 0) {
            const user = users[0];
            const passwordMatch = await bcryptjs.compare(password, user.password);

            if (passwordMatch) {
                // Store user info in session
                req.session.user = {
                    id: user.iduser,  // Assuming `iduser` is the identifier in your database
                    username: user.username,
                    photo: user.photo ? `http://localhost:5001/uploads/${user.photo}` : null
                    // You can add more user specific details here if necessary
                };

                res.status(200).json({ message: "Login successful", photo: req.session.user.photo });
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

// Logout route
router.post('/logout', (req, res) => {
    if (req.session) {
        // destroy the session
        req.session.destroy(err => {
            if (err) {
                // Failed to destroy session
                res.status(500).send('Failed to logout');
            } else {
                // Session destroyed
                res.clearCookie('session_cookie_name'); // Match the name of your session cookie
                res.json({ message: 'Logged out successfully' });
            }
        });
    } else {
        // No session found
        res.status(404).send('No session found');
    }
});

// GET route to fetch current user session data
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({
            message: 'Current session data',
            sessionData: req.session.user
        });
    } else {
        res.status(404).json({ message: 'No active session found' });
    }
});

// GET route to fetch all users
router.get('/getall', async (req, res) => {
    try {
        const sql = 'SELECT iduser, name_first, name_second, office, department, user_type, photo FROM user';
        const [users] = await db.promise().query(sql);

        // Assuming you want to convert the photo BLOB to a Base64 string before sending it to the client
        const usersWithBase64Photos = users.map(user => ({
            ...user,
            photo: user.photo ? Buffer.from(user.photo).toString('base64') : null,
        }));

        res.json(usersWithBase64Photos);
    } catch (err) {
        console.error("Error fetching users: ", err);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// GET route to fetch specific user details
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'SELECT iduser, name_first, name_second, username, password, photo FROM user WHERE iduser = ?';
        const [results] = await db.promise().query(sql, [id]);

        if (results.length > 0) {
            const user = results[0];
            user.photo = user.photo ? `http://localhost:5001/uploads/${user.photo}` : null;
            res.json({
                message: 'User details fetched successfully',
                userDetails: {
                    iduser: user.iduser,
                    nameFirst: user.name_first,
                    nameSecond: user.name_second,
                    username: user.username,
                    password: user.password,
                    photo: user.photo
                }
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error("Error fetching user details:", err);
        res.status(500).json({ message: "Error fetching user details" });
    }
});

// Route to check if username is unique
router.get('/check-username', async (req, res) => {
    const { username } = req.query;
    try {
        const sql = 'SELECT COUNT(*) AS count FROM user WHERE username = ?';
        const [result] = await db.promise().query(sql, [username]);
        const isUnique = result[0].count === 0;
        res.json({ isUnique });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).send('Error checking username');
    }
});

// PUT route to update an existing user's profile
router.put('/updateProfile/:iduser', upload.single('photo'), async (req, res) => {
    const { iduser } = req.params;
    const { name_first, name_second, username, password } = req.body;
    let photo = req.file ? req.file.filename : null;

    try {
        let sql = 'UPDATE user SET ';
        const changes = [];
        const params = [];

        // Add checks for each parameter to ensure it's provided before adding to the query
        if (name_first) {
            changes.push('name_first = ?');
            params.push(name_first);
        }
        if (name_second) {
            changes.push('name_second = ?');
            params.push(name_second);
        }
        if (username) {
            changes.push('username = ?');
            params.push(username);
        }

        // Update the photo if a new one is uploaded
        if (photo) {
            changes.push('photo = ?');
            params.push(photo);
        }

        // Only update the password if one is provided
        if (password && password.trim() !== '') {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);
            changes.push('password = ?');
            params.push(hashedPassword);
        }

        // If no fields are provided to update, return an error
        if (changes.length === 0) {
            res.status(400).json({ message: 'No updates provided' });
            return;
        }

        // Append the user ID to the parameters and finalize the SQL statement
        sql += changes.join(', ') + ' WHERE iduser = ?';
        params.push(iduser);

        // Execute the update query
        await db.promise().query(sql, params);
        res.json({ 
            message: 'User profile updated successfully', 
            photoUrl: photo ? `http://localhost:5001/uploads/${photo}` : req.body.currentPhoto // send back new photo URL or current
        });

    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).send('Error updating user profile');
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