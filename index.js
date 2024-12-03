const express = require("express");
const app = express();
const port = 3000;
const secret = "secret0086";

const { authentication } = require("./db/users.js")
const jwt = require("jsonwebtoken");
const { list } = require("./db/posts.js");
app.use(express.json());

app.listen(port, () => console.log(`Aplicación en ejecución por el puerto ${port}`));

app.post("/login", async (request, response) => {
    const user = await authentication(request.body.username, request.body.password);
    if(!user) {
        return response.status(401).json({ message: "Autenticación fallida"});
    }
    const token = jwt.sign(user,secret);
    response.json({ message: "Autenticación exitosa", token });
});

app.get("/posts", async(request, response) => {
    if(!request.headers.authorization) {
        return response.status(401).json({ message: "Enviar el token"});
    }
    const payload = jwt.verify(request.headers.authorization, secret);
    const posts = await list(payload.id);
    response.json({ message: "Listado de posts", data: posts });
})