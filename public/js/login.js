// ==========================
// Lógica de Login y Registro
// ==========================

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // Evento para iniciar sesión
    loginForm?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const usuario = document.getElementById("usuarioLogin").value.trim();
        const contraseña = document.getElementById("contraseñaLogin").value.trim();

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, contraseña })
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = "/bienvenida"; // 🚀 Ir a la pantalla de bienvenida
            } else {
                alert(data.message || "Usuario o contraseña incorrectos.");
                loginForm.reset();
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Ocurrió un error en el inicio de sesión.");
        }
    });

    // Evento para registrar usuario
    registerForm?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombreCompleto = document.getElementById("nombreCompleto").value.trim();
        const usuario = document.getElementById("usuarioRegistro").value.trim();
        const contraseña = document.getElementById("contraseñaRegistro").value.trim();

        try {
            const response = await fetch("/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_completo: nombreCompleto, usuario, contraseña })
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = "/bienvenida"; // 🚀 Redirige después de registrarse
            } else {
                // Si existe, muestra el nombre del cliente existente
                if (data.nombre) {
                    alert(`El usuario ya existe. Cliente: ${data.nombre}`);
                } else {
                    alert(data.message || "No se pudo registrar.");
             }
            }
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Ocurrió un error al registrar.");
        }
    });
});

// ==========================
// Cerrar Sesión
// ==========================
function cerrarSesion() {
    fetch("/logout", { method: "POST" })
        .then(() => {
            alert("Sesión cerrada correctamente.");
            window.location.href = "index.html";
        })
        .catch(err => console.error("Error al cerrar sesión:", err));
}