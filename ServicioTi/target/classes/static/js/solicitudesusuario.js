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

function cargarSolicitudEnFormulario(id) {
  const token = localStorage.getItem("token");

  console.log("🔄 Cargando solicitud para edición - ID:", id);

  fetch(`http://localhost:8080/solicitudes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((solicitud) => {
      console.log("📋 Datos de la solicitud:", solicitud);

      document.querySelector("input[name='titulo']").value =
        solicitud.titulo || "";
      document.querySelector("input[name='descripcion']").value =
        solicitud.descripcion || "";
      // Cambiado a input hidden para estado
      document.querySelector("input[name='estado']").value =
        solicitud.estado || "NUEVO";
      document.querySelector("select[name='prioridad']").value =
        solicitud.prioridad || "MEDIA";
      document.querySelector("input[name='solicitanteId']").value =
        solicitud.solicitante?.id || "";

      document
        .getElementById("formSolicitud")
        .setAttribute("data-editando-id", id);
      document.querySelector(".btn-agregar").textContent =
        "Actualizar Solicitud";

      console.log("✏️ Modo edición activado");
    })
    .catch((error) => {
      console.error("❌ Error al cargar solicitud para editar:", error);
    });
}

function configurarFormulario() {
  document
    .getElementById("formSolicitud")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const idEditando = e.target.getAttribute("data-editando-id");
      const method = idEditando ? "PUT" : "POST";
      const url = idEditando
        ? `http://localhost:8080/solicitudes/${idEditando}`
        : "http://localhost:8080/solicitudes";

      const payload = {
        titulo: document.querySelector("input[name='titulo']").value,
        descripcion: document.querySelector("input[name='descripcion']").value,
        estado: document.querySelector("input[name='estado']").value,
        prioridad: document.querySelector("select[name='prioridad']").value,
        solicitanteId: parseInt(
          document.querySelector("input[name='solicitanteId']").value
        ),
      };

      console.log("📤 Enviando formulario:", { method, url, payload });

      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error al guardar/actualizar");
          return response.json();
        })
        .then(() => {
          console.log(
            idEditando ? "✅ Solicitud actualizada" : "✅ Solicitud creada"
          );
          cargarSolicitudesUsuario();
          e.target.reset();
          e.target.removeAttribute("data-editando-id");
          document.querySelector(".btn-agregar").textContent =
            "Guardar Solicitud";
          cargarIdSolicitanteDesdeToken();
        })
        .catch((error) => {
          console.error("❌ Error al guardar/actualizar:", error);
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
