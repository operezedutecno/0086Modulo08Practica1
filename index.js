const express = require("express");
const app = express();
const port = 3000;
const secret = "secret0086";

const { authentication } = require("./db/users.js")
const jwt = require("jsonwebtoken");
const { list, register, show, update } = require("./db/posts.js");
app.use(express.json());
app.use("/public", express.static(`${__dirname}/assets`));

app.listen(port, () => console.log(`Aplicación en ejecución por el puerto ${port}`));


app.get("/", (request, response) => {
    response.sendFile(`${__dirname}/views/index.html`);
});
app.post("/login", async (request, response) => {
    console.log(request.body);
    const user = await authentication(request.body.username, request.body.password);
    if(!user) {
        return response.status(401).json({ message: "Autenticación fallida"});
    }
    const token = jwt.sign(user,secret);
    response.json({ message: "Autenticación exitosa", token });
});

app.get("/verify-token", (request, response) => {
    if(!request.headers.authorization) {
        return response.status(401).json({ message: "Enviar el token"});
    }

    try {
        var payload = jwt.verify(request.headers.authorization, secret);
    } catch (error) {
        return response.status(401).json({ message: "Token inválido"});
    }

    return response.json({ message: "Token válido"})
});

app.get("/posts", async(request, response) => {
    if(!request.headers.authorization) {
        return response.status(401).json({ message: "Enviar el token"});
    }
    const payload = jwt.verify(request.headers.authorization, secret);
    const posts = await list(payload.id);
    response.json({ message: "Listado de posts", data: posts });
})

app.post("/posts", async(request, response) => {
    if(!request.headers.authorization) {
        return response.status(401).json({ message: "Enviar el token"});
    }

    try {
        var payload = jwt.verify(request.headers.authorization, secret);
    } catch (error) {
        return response.status(401).json({ message: "Token inválido"});
    }

    const { title, content } = request.body;
    const post = await register(title, content, payload.id);
    response.json({ message: "Post registrado con éxito", data: post});
});

app.put("/posts/:id", async (request, response) => {
    const token = request.headers.authorization;
    if(!token) {
        return response.status(401).json({ message: "Enviar el token"});
    }

    try {
        var payload = jwt.verify(token, secret);
    } catch (error) {
        return response.status(401).json({ message: "Token inválido"});
    }

    const post = await show(request.params.id);

    if(!post) {
        return response.status(404).json({ message: "Post no encontrado"});
    }

    if(payload.id != post.user_id) {
        return response.status(401).json({ message: "Usted no es el propietario de este post"});
    }

    const {title, content} = request.body
 
    const data = await update(title, content, request.params.id);
    response.json({message: "Post modificado con éxito", data: data });
})