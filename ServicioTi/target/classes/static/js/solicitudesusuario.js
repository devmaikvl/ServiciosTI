document.addEventListener("DOMContentLoaded", () => {
  cargarIdSolicitanteDesdeToken();
  cargarSolicitudesUsuario();
  configurarFormulario();
  delegarAccionesTabla();
});

function cargarIdSolicitanteDesdeToken() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const payloadBase64 = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payloadBase64));
  const id = decodedPayload.id;

  document.getElementById("solicitanteId").value = id;
  return id;
}

function cargarSolicitudesUsuario() {
  const token = localStorage.getItem("token");
  const solicitanteId = cargarIdSolicitanteDesdeToken();

  if (!solicitanteId) {
    console.error("No hay token o id de usuario");
    return;
  }

  fetch(`http://localhost:8080/solicitudes/usuario/${solicitanteId}`, {
    // <-- EndPoint debe filtrar por usuario
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al obtener solicitudes");
      return response.json();
    })
    .then((data) => {
      const tabla = document.getElementById("tablaSolicitudes");
      tabla.innerHTML = "";

      if (data.length === 0) {
        tabla.innerHTML =
          "<tr><td colspan='6'>No tienes solicitudes registradas.</td></tr>";
        return;
      }

      data.forEach((solicitud) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
          <td>${solicitud.titulo}</td>
          <td>${solicitud.descripcion}</td>
          <td>${formatearEstado(solicitud.estado)}</td>
          <td>${formatearPrioridad(solicitud.prioridad)}</td>
          <td>${formatearFecha(solicitud.creadoEn)}</td>
          <td>
            <button class="btn-editar" data-id="${solicitud.id}">Editar</button>
          </td>
        `;

        tabla.appendChild(fila);
      });
    })
    .catch((error) => {
      console.error("Error cargando solicitudes:", error);
      document.getElementById("tablaSolicitudes").innerHTML =
        "<tr><td colspan='6'>Error al cargar solicitudes.</td></tr>";
    });
}

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const f = new Date(fecha);
  return f.toLocaleString("es-CR");
}

function formatearEstado(estado) {
  switch (estado) {
    case "NUEVO":
      return "Nuevo";
    case "PROCESANDO":
      return "Procesando";
    case "SOLUCIONADO":
      return "Solucionado";
    case "PENDIENTE":
      return "Pendiente";
    default:
      return estado;
  }
}

function formatearPrioridad(prioridad) {
  switch (prioridad) {
    case "BAJA":
      return "Baja";
    case "MEDIA":
      return "Media";
    case "ALTA":
      return "Alta";
    default:
      return prioridad;
  }
}

// Delegar evento click para botones "Editar"
function delegarAccionesTabla() {
  document
    .getElementById("tablaSolicitudes")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("btn-editar")) {
        const id = e.target.getAttribute("data-id");
        cargarSolicitudEnFormulario(id);
      }
    });
}

function cargarUsuarioEnFormulario(id) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:8080/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("No se pudo cargar el usuario");
      return res.json();
    })
    .then((usuario) => {
      // Rellenar el formulario con datos
      document.querySelector("input[name='nombre']").value =
        usuario.nombre || "";
      document.querySelector("input[name='usuario']").value =
        usuario.username || "";
      document.querySelector("input[name='contrasena']").value = ""; // no mostrar la contraseña
      document.querySelector("select[name='departamento']").value =
        usuario.departamento || "";
      document.querySelector("select[name='tipousuario']").value =
        usuario.rol || "";

      // Guardar id para edición
      document
        .getElementById("formAgregarUsuario")
        .setAttribute("data-editando-id", id);

      // Cambiar texto botón
      document.querySelector(".btn-agregar").textContent = "Actualizar Usuario";
    })
    .catch((err) => {
      console.error("Error al cargar usuario para edición:", err);
    });
}

// Configura el formulario para crear o actualizar usuario
function configurarFormularioUsuarios() {
  document
    .getElementById("formAgregarUsuario")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const idEditando = e.target.getAttribute("data-editando-id");
      const method = idEditando ? "PUT" : "POST";
      const url = idEditando
        ? `http://localhost:8080/usuarios/${idEditando}`
        : "http://localhost:8080/usuario";

      const payload = {
        nombre: document.querySelector("input[name='nombre']").value,
        username: document.querySelector("input[name='usuario']").value,
        password: document.querySelector("input[name='contrasena']").value,
        departamento: document.querySelector("select[name='departamento']")
          .value,
        rol: document.querySelector("select[name='tipousuario']").value,
      };

      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error("Error al guardar/actualizar usuario");
          return response.json();
        })
        .then(() => {
          e.target.reset();
          e.target.removeAttribute("data-editando-id");
          document.querySelector(".btn-agregar").textContent =
            "Agregar Usuario";
          cargarUsuarios();
        })
        .catch((error) => {
          console.error("Error al guardar/actualizar usuario:", error);
        });
    });
}

// Asignar eventos a botones editar y eliminar
function asignarEventosBotones() {
  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      cargarUsuarioEnFormulario(id);
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      eliminarUsuario(id);
    });
  });
}
