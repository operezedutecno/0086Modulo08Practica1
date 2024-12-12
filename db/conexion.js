const { Pool } = require("pg")

const conexion = new Pool({
    host: 'autorack.proxy.rlwy.net',
    port: 30809,
    database: 'railway',
    user: 'postgres',
    password: 'pcLWkRVMTxQWggLgZGkTtBktXOACbQIQ'
});

module.exports = conexion;