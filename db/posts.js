const conexion = require("./conexion.js");


const list = async(userId) => {
    const posts = await conexion.query("SELECT * FROM posts WHERE user_id=$1", [userId]);
    return posts.rows;
}

module.exports = { list }