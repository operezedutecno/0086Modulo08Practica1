const conexion = require("./conexion.js");


const list = async(userId) => {
    const posts = await conexion.query("SELECT * FROM posts WHERE user_id=$1", [userId]);
    return posts.rows;
}

const show = async(postId) => {
    const response = await conexion.query("SELECT * FROM posts WHERE id = $1", [postId]);
    return response.rowCount > 0 ? response.rows[0] : null;
}

const register = async(title, content, userId) => {
    const response = await conexion.query(
            "INSERT INTO posts(title, content, user_id) VALUES($1, $2, $3) RETURNING *", 
            [title, content, userId]
    );
    return response.rows;
}

const update = async(title, content, postId) => {
    const response = await conexion.query(
        "UPDATE posts SET title=$1, content=$2 WHERE id=$3 RETURNING *", 
        [title,content,postId]
    );
    return response.rows;
}

module.exports = { list, register, show, update }