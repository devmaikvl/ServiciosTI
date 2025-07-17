document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("usuario").value;
    const password = document.getElementById("contrasena").value;

    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const errorMsg = document.getElementById("error-msg");

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      
      localStorage.setItem("token", token);

      
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const rol = decodedPayload.role;

      
      if (rol === "ADMIN") {
        window.location.href = "/views/dashboardtecnico.html";
      } else if (rol === "USUARIO") {
        window.location.href = "/views/dashboardusuario.html";
      } else {
        errorMsg.innerText = "Rol no reconocido.";
      }
    } else {
      errorMsg.innerText = "Usuario o contraseña inválidos.";
    }
  });
});