document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();

  const form = document.getElementById("formAgregarUsuario");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const id = form.dataset.id;

    const payload = {
      nombre: form.querySelector("input[name='nombre']").value,
      username: form.querySelector("input[name='username']").value,
      password: form.querySelector("input[name='password']").value,
      email: form.querySelector("input[name='email']").value,
      departamento: form.querySelector("select[name='departamento']").value,
      rol: form.querySelector("select[name='rol']").value,
    };

    const url = id
      ? `http://localhost:8080/usuarios/${id}`
      : "http://localhost:8080/usuarios";
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
        delete form.dataset.id;
        cargarUsuarios();
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
      tabla.innerHTML = "";

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

      agregarEventosBotones();
    })
    .catch((err) => {
      console.error("Error al cargar usuarios:", err);
      document.querySelector(".usuariosTable tbody").innerHTML =
        "<tr><td colspan='5'>Error al cargar usuarios.</td></tr>";
    });
}

function agregarEventosBotones() {
  const token = localStorage.getItem("token");

  document.querySelectorAll(".btn-editar").forEach((boton) => {
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
          const form = document.getElementById("formAgregarUsuario");
          form.querySelector("input[name='nombre']").value = usuario.nombre;
          form.querySelector("input[name='username']").value = usuario.username;
          form.querySelector("input[name='password']").value = "";
          form.querySelector("input[name='email']").value = usuario.email;
          form.querySelector("select[name='departamento']").value =
            usuario.departamento;
          form.querySelector("select[name='rol']").value = usuario.rol;
          form.dataset.id = id;
        })
        .catch((err) => {
          console.error("Error cargando usuario para edición:", err);
        });
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = boton.dataset.id;

      if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        fetch(`http://localhost:8080/usuarios/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error al eliminar usuario");
            return res.text();
          })
          .then(() => {
            cargarUsuarios();
          })
          .catch((err) => {
            console.error("Error al eliminar usuario:", err);
          });
      }
    });
  });
}
