document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();

  document
    .getElementById("formAgregarUsuario")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const form = e.target;
      const id = form.dataset.id; // Si hay ID, es edición

      const payload = {
        nombre: document.querySelector("input[name='nombre']").value,
        username: document.querySelector("input[name='username']").value,
        password: document.querySelector("input[name='password']").value,
        email: document.querySelector("input[name='email']").value,
        departamento: document.querySelector("select[name='departamento']")
          .value,
        rol: document.querySelector("select[name='rol']").value,
      };

      const url = id
        ? `http://localhost:8080/usuarios/${id}`
        : "http://localhost:8080/usuario";
      const method = id ? "PUT" : "POST";

      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error al guardar usuario");
          return response.json();
        })
        .then(() => {
          form.reset();
          delete form.dataset.id; // limpiar el ID para modo agregar
          cargarUsuarios(); // recargar tabla
        })
        .catch((error) => {
          console.error("Error guardando usuario:", error);
        });
    });
});

function cargarUsuarios() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:8080/usuarios", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al obtener usuarios");
      return res.json();
    })
    .then((data) => {
      const tabla = document.querySelector(".usuariosTable tbody");
      tabla.innerHTML = ""; // Limpiar tabla

      if (data.length === 0) {
        tabla.innerHTML =
          "<tr><td colspan='5'>No hay usuarios registrados.</td></tr>";
        return;
      }

      data.forEach((usuario) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
          <td>${usuario.nombre}</td>
          <td>${usuario.username}</td>
          <td>${usuario.departamento}</td>
          <td>${usuario.rol}</td>
          <td>
            <button class="btn-editar" data-id="${usuario.id}">Editar</button>
            <button class="btn-eliminar" data-id="${usuario.id}">Eliminar</button>
          </td>
        `;

        tabla.appendChild(fila);
      });

      // ✅ Agregar eventos a los botones de editar
      tabla.querySelectorAll(".btn-editar").forEach((boton) => {
        boton.addEventListener("click", () => {
          const id = boton.dataset.id;

          fetch(`http://localhost:8080/usuarios/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("No se pudo obtener el usuario");
              return res.json();
            })
            .then((usuario) => {
              // Rellenar el formulario con los datos del usuario
              document.querySelector("input[name='nombre']").value =
                usuario.nombre;
              document.querySelector("input[name='username']").value =
                usuario.username;
              document.querySelector("input[name='password']").value = ""; // por seguridad
              document.querySelector("input[name='email']").value =
                usuario.email;
              document.querySelector("select[name='departamento']").value =
                usuario.departamento;
              document.querySelector("select[name='rol']").value = usuario.rol;

              // Guardar el ID en el formulario (modo edición)
              document.getElementById("formAgregarUsuario").dataset.id = id;
            })
            .catch((err) => {
              console.error("Error cargando usuario para edición:", err);
            });
        });
      });
    })
    .catch((err) => {
      console.error("Error al cargar usuarios:", err);
      document.querySelector(".usuariosTable tbody").innerHTML =
        "<tr><td colspan='5'>Error al cargar usuarios.</td></tr>";
    });
}
