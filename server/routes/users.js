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
        console.log("Users found: ", users);

        if (users.length > 0) {
            const user = users[0];
            console.log("User found: ", user);
            const passwordMatch = await bcryptjs.compare(password, user.password);
            console.log("Password match: ", passwordMatch);

            if (passwordMatch) {
                // Assuming `photo` is the column name where the photo filename is stored
                const photo = user.photo ? `http://localhost:5001/uploads/${user.photo}` : null;

                // Including the photo URL in the response
                res.status(200).json({ message: "Login successful", photo: photo });
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

// PUT route to update an existing user
router.put('/update/:iduser', async (req, res) => {
    const { iduser } = req.params;
    const { name_first, name_second, office, department, user_type, photo } = req.body;

    if (!iduser) {
        return res.status(400).send('User ID is required');
    }

    try {
        // Decode base64 photo to binary buffer if photo is provided
        const photoBuffer = photo ? Buffer.from(photo, 'base64') : null;

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
        // Pass the binary photo buffer to the database
        await db.promise().query(query, [name_first, name_second, office, department, user_type, photoBuffer, iduser]);
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