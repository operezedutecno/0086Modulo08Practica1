$(() => {
    $("#btn-submit").click(function(event) {
        event.preventDefault();

        const username = $("#txt-username").val();
        const password = $("#txt-password").val();

        $.ajax({
            method: "POST",
            url: "/login",
            contentType: "application/json",
            data: JSON.stringify({ username, password }),
            success: function(response) {
                localStorage.setItem("token", response.token);
            }
        })

    });
}) 