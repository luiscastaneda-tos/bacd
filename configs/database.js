const mysql = require("mysql2/promise");
require("dotenv").config();

async function query(sql, params) {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOSTNAME,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    });

    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { query };
