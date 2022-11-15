require('dotenv').config();

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT,
    // ssl: { rejectUnauthorized: false }
  }
})

module.exports = knex;