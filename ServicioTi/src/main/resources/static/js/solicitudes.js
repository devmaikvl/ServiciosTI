document.addEventListener('DOMContentLoaded', () => {
  cargarSolicitudes();
  configurarFormulario();
  delegarAccionesTabla();
  cargarIdSolicitanteDesdeToken();
});

function cargarSolicitudes() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:8080/solicitudes", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener solicitudes");
      return response.json();
    })
    .then(data => {
      const tabla = document.getElementById("tablaSolicitudes");
      tabla.innerHTML = "";

      if (data.length === 0) {
        tabla.innerHTML = "<tr><td colspan='7'>No hay solicitudes registradas.</td></tr>";
        return;
      }

      data.forEach(solicitud => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
          <td>${solicitud.titulo}</td>
          <td>${solicitud.descripcion}</td>
          <td>${formatearEstado(solicitud.estado)}</td>
          <td>${formatearPrioridad(solicitud.prioridad)}</td>
          <td>${formatearFecha(solicitud.creadoEn)}</td>
          
          <td>${solicitud.solicitante?.nombre || "Desconocido"}</td>
          <td>
            <button class="btn-editar" data-id="${solicitud.id}">Editar</button>
            <button class="btn-cerrar" data-id="${solicitud.id}">Cerrar</button>
            <button class="btn-eliminar" data-id="${solicitud.id}">Eliminar</button>
          </td>`;

        tabla.appendChild(fila);
      });
    })
    .catch(error => {
      console.error("Error cargando solicitudes:", error);
      document.getElementById("tablaSolicitudes").innerHTML = "<tr><td colspan='7'>Error al cargar solicitudes.</td></tr>";
    });
}

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const f = new Date(fecha);
  return f.toLocaleString("es-CR");
}

function formatearEstado(estado) {
  switch (estado) {
    case "ABIERTA": return "Abierta";
    case "EN_PROCESO": return "En Proceso";
    case "CERRADA": return "Cerrada";
    default: return estado;
  }
}

function formatearPrioridad(prioridad) {
  switch (prioridad) {
    case "BAJA": return "Baja";
    case "MEDIA": return "Media";
    case "ALTA": return "Alta";
    default: return prioridad;
  }
}

// Escucha eventos en los botones de la tabla
function delegarAccionesTabla() {
  document.getElementById("tablaSolicitudes").addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-editar")) {
      const id = e.target.getAttribute("data-id");
      cargarSolicitudEnFormulario(id);
    }
    if (e.target.classList.contains("btn-cerrar")) {
      const id = e.target.getAttribute("data-id");
      cerrarSolicitud(id);
    }

    if (e.target.classList.contains("btn-eliminar")) {
      const id = e.target.getAttribute("data-id");
      eliminarSolicitud(id);
    }


  });
}

// Rellena el formulario con los datos de una solicitud existente
function cargarSolicitudEnFormulario(id) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:8080/solicitudes/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(solicitud => {
      document.querySelector("input[name='titulo']").value = solicitud.titulo || "";
      document.querySelector("input[name='descripcion']").value = solicitud.descripcion || "";
      document.querySelector("select[name='estado']").value = solicitud.estado || "ABIERTA";
      document.querySelector("select[name='prioridad']").value = solicitud.prioridad || "MEDIA";
      document.querySelector("input[name='solicitanteId']").value = solicitud.solicitante?.id || "";

      // Guardamos el ID actual para saber que es edición
      document.getElementById("formSolicitud").setAttribute("data-editando-id", id);

      // Cambiamos el botón
      document.querySelector(".btn-agregar").textContent = "Actualizar Solicitud";
    })
    .catch(error => {
      console.error("Error al cargar solicitud para editar:", error);
    });
}

// Configura el evento submit para crear o actualizar
function configurarFormulario() {
  document.getElementById("formSolicitud").addEventListener("submit", function (e) {
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
      estado: document.querySelector("select[name='estado']").value,
      prioridad: document.querySelector("select[name='prioridad']").value,
      solicitanteId: parseInt(document.querySelector("input[name='solicitanteId']").value)
    };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) throw new Error("Error al guardar/actualizar");
        return response.json();
      })
      .then(() => {
        cargarSolicitudes(); // recarga la tabla
        e.target.reset(); // limpia el form
        e.target.removeAttribute("data-editando-id");
        document.querySelector(".btn-agregar").textContent = "Guardar Solicitud";
        cargarIdSolicitanteDesdeToken()
      })
      .catch(error => {
        console.error("Error al guardar/actualizar:", error);
      });
  });

  
}

function eliminarSolicitud(id) {
  const token = localStorage.getItem("token");

  if (!confirm("¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer.")) {
    return;
  }

  fetch(`http://localhost:8080/solicitudes/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo eliminar la solicitud");
      cargarSolicitudes(); // refrescar tabla
    })
    .catch(err => {
      console.error("Error al eliminar la solicitud:", err);
    });
}


function cargarIdSolicitanteDesdeToken() {
  const token = localStorage.getItem("token");
const payloadBase64 = token.split('.')[1];
const decodedPayload = JSON.parse(atob(payloadBase64));
console.log(decodedPayload);

document.getElementById("solicitanteId").value = decodedPayload.id;
}

function cerrarSolicitud(id) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:8080/solicitudes/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo obtener la solicitud");
      return res.json();
    })
    .then(solicitud => {
      const payload = {
        titulo: solicitud.titulo,
        descripcion: solicitud.descripcion,
        prioridad: solicitud.prioridad,
        estado: "SOLUCIONADO",
        solicitanteId: solicitud.solicitante.id,
        finalizadaEn: new Date().toISOString()  // <- esta es la clave
      };

      return fetch(`http://localhost:8080/solicitudes/${id}/cerrar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cerrar la solicitud");
      cargarSolicitudes(); // recargar la tabla
    })
    .catch(err => {
      console.error("Error al cerrar la solicitud:", err);
    });
}



