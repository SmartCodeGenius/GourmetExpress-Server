const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    password: 'senai',
    host: 'localhost',
    port: 5432,
    database: 'gourmetexpress'
});

module.exports = pool;