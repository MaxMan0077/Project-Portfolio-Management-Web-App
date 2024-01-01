console.log('Starting the database connection test...');

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Uptix1478',
    database: 'ppm_database'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');

    connection.query('SELECT NOW()', (err, results, fields) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        console.log('Current Date and Time in MySQL:', results[0]['NOW()']);
        connection.end();
    });
});
