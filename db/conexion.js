const { Pool } = require("pg")

console.log( { host: process.env.DB_HOST, port: process.env.DB_PORT});
console.log(process.env);

const conexion = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

module.exports = conexion;