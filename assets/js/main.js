$(() => {
    $("#btn-submit").click(function(event) {
        event.preventDefault();

        $(".error-message").html(""); // Limpiar mensajes de error
        $("#message-error").addClass("d-none")

        const username = $("#txt-username").val();
        const password = $("#txt-password").val();

        let validacion = true;

        if(username.trim() == "") {
            $("#error-username").html("Ingresar usuario");
            validacion = false
        }

        if(password.trim() == "") {
            $("#error-password").html("Ingresar contraseña");
            validacion = false
        }

        if(validacion) {
            $.ajax({
                method: "POST",
                url: "/login",
                contentType: "application/json",
                data: JSON.stringify({ username, password }),
                success: function(response) {
                    localStorage.setItem("token", response.token);
                    $("#content-login").addClass("d-none");
                    $(".logged, #btn-logout").removeClass("d-none");
                    postsList();
                },
                error: function(error) {
                    if(error.status == 401) {
                        return $("#message-error").removeClass("d-none").html(error.responseJSON.message)
                    }
                    return $("#message-error").removeClass("d-none").html("Ocurrió un error en el servidor")
                }
            })
        }

    });

    $("#btn-register").click(function(event) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        const title = $("#txt-title").val();
        const content = $("#txt-content").val();

        $(".error-message").html("");

        let validacion = true;

        if(title.trim() == "") {
            $("#error-title").html("Ingresar el título");
            validacion = false;
        }

        if(content.trim() == "") {
            $("#error-content").html("Ingresar el contenido");
            validacion = false;
        }

        $.ajax({
            method: "POST",
            url: "/posts",
            contentType: "application/json",
            headers: {
                "authorization": token
            },
            data: JSON.stringify({ title: title, content: content }),
            success: function(response) {
                $("#txt-title, #txt-content").val("");
                alert("Registro de post exitoso");
                postsList();
            },
            error: function(error) {
                if(error.status == 401) {
                    return $("#message-error").removeClass("d-none").html(error.responseJSON.message)
                }
                return $("#message-error").removeClass("d-none").html("Ocurrió un error en el servidor")
            }
        })
    })

    $("#btn-logout").click(function() {
        if(confirm("¿Seguro desea cerrar sesión?")) {
            localStorage.removeItem("token");
            $("#content-login").removeClass("d-none");
            $(".logged, #btn-logout").addClass("d-none");
        }
    })

    const postsList = () => {
        const token = localStorage.getItem("token");
        $.ajax({
            method: "GET",
            url: "/posts",
            headers: {
                "authorization": token
            },
            success: function(response) {
                $("#table-posts tbody").html("");
                for (const post of response.data) {
                    $("#table-posts tbody").append(`
                        <tr>
                            <td>${post.id}</td>
                            <td>${post.title}</td>
                            <td>${post.content}</td>
                        </tr>  
                    `);
                }
            }
        })
    }


    const verifyToken = () => {
        const token = localStorage.getItem("token");
        if(!token)
            return null

        $.ajax({
            method: "GET",
            url: "/verify-token",
            headers: {
                "authorization": token
            },
            success: function() {
                $("#content-login").addClass("d-none");
                $(".logged, #btn-logout").removeClass("d-none");
                postsList();
            }
        })
    }

    verifyToken();
}) 