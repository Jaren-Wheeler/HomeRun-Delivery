const sql = require('mssql');
require('dotenv').config();

// database configuration. Data sourced in environment variables
config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT,10),
    options: {
        encrypt: true,
        trustServerCertificate: true // used for development. Require proper certificate when deployed
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Connection pool. Allows for connections to be established with the database without creating new connections each time
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Connected to SQL Server");
        return pool
    })
    .catch(err => {
        console.error('Database connection failed', err);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise
}