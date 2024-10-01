const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const path = require('path');

// Configure MySQL session store
const sessionStoreOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ppm_database'
};

const sessionStore = new MySQLStore(sessionStoreOptions);

// Session middleware configuration
app.use(session({
    key: 'session_cookie_name',
    secret: 'your_secret_key',
    store: sessionStore, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000 // 24 hours in milliseconds
    }
}));

// CORS configuration to allow credentials and specify the client origin
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Environment variable for the port or default to 5001
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
