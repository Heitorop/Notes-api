import pkg from "pg";
import "dotenv/config";
const { Client } = pkg;

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


await client.connect();

console.log("Connected to PostgreSQL");

// test a query
const res = await client.query("SELECT NOW()");
console.log(res.rows);

await client.end();
