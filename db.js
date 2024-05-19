const pg = require('pg');

const client = new pg.Client({
   host: 'localhost',
   user: 'postgres',
   password: 'postgres',
   database: 'books',
});

module.exports = client;
