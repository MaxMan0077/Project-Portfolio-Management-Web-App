const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Uptix1478',
    database: 'ppm_database'
});
module.exports = connection;
