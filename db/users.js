const conexion = require("./conexion.js");

const authentication = async (username, pass) => {
    try {
        const response = await conexion.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, pass]);
        if(response.rowCount == 0) {
            return null
        }
        const { password, ...user} = response.rows[0]
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
    
}

module.exports = { authentication }