const mysql = require("mysql2/promise");
require("dotenv").config()

async function query(sql, params) {

    const connection = await mysql.createConnection({
        host: process.env.HOSTNAME,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    })

    try {
        const [results, ] = await connection.execute(sql, params);
        return results;

    } catch (error) {
        console.error(error)
    } finally {
        await connection.end()
    }
}

module.exports = { query }