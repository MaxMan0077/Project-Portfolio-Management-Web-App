const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const path = require('path');

// Configure MySQL session store
const sessionStoreOptions = {
    host: 'your_mysql_host', // Replace with your MySQL server host
    port: 3306, // Default MySQL port
    user: 'your_mysql_user', // Your MySQL username
    password: 'your_mysql_password', // Your MySQL password
    database: 'your_mysql_database' // Your MySQL database where sessions will be stored
};

const sessionStore = new MySQLStore(sessionStoreOptions);

// Session middleware configuration
app.use(session({
    key: 'session_cookie_name', // The name of the cookie
    secret: 'your_secret_key', // Secret key to sign the session ID cookie
    store: sessionStore, // Use MySQL session store
    resave: false, // Do not resave sessions that haven't been modified
    saveUninitialized: false, // Do not save uninitialized sessions
    cookie: {
        maxAge: 86400000 // 24 hours in milliseconds
    }
}));

// Configure CORS to allow credentials and specify the client origin
app.use(cors({
    origin: 'http://localhost:3000', // Specify the client origin explicitly
    credentials: true // Critical for cookies, authorization headers with HTTPS
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
