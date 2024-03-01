const express = require('express');
const cors = require('cors'); // Import cors
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const mainRoutes = require('./routes/main');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');
const statusReportRoutes = require('./routes/reports');

// Route middlewares
app.use('/api/main', mainRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/reports', statusReportRoutes);

// Default route for the server
app.get('/', (req, res) => {
    res.send('Welcome to the Project Management API!');
});

// Environment variable for the port or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
