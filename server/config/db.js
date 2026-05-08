const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'codequest',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// We catch pool errors to prevent immediate crash if DB is not connected yet
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.warn('Database connection failed (You can connect it later):', err.message);
    });

module.exports = pool;
