document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout");

  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("token"); // Elimina el token del almacenamiento local
    window.location.href = "/views/login.html"; // Redirige al login
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const btnMantenimiento = document.getElementById("btn-mantenimiento");

  btnMantenimiento.addEventListener("click", function () {
    window.location.href = "/views/mantenimientousuario.html";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const Solicitudes = document.getElementById("Solicitudes");

  Solicitudes.addEventListener("click", function () {
    window.location.href = "/views/solicitudes.html";
  });
});

document.addEventListener('DOMContentLoaded', () => {
  cargarSolicitudesUsuario();
});

function cargarSolicitudesUsuario() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return;
  }
  
  // Extraemos el id del usuario del token JWT
  const payloadBase64 = token.split('.')[1];
  const decodedPayload = JSON.parse(atob(payloadBase64));
  const usuarioId = decodedPayload.id;

  fetch(`http://localhost:8080/solicitudes/usuario/${usuarioId}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al obtener solicitudes');
      return response.json();
    })
    .then(data => {
      const contenedor = document.querySelector('.lista-tareas');
      contenedor.innerHTML = '';

      if (data.length === 0) {
        contenedor.innerHTML = '<p>No tienes solicitudes registradas.</p>';
        return;
      }

      data.forEach(solicitud => {
        const divSolicitud = document.createElement('div');
        divSolicitud.classList.add('solicitud-card');

        divSolicitud.innerHTML = `
          <h4>${solicitud.titulo}</h4>
          <p>${solicitud.descripcion}</p>
          <p><strong>Estado:</strong> ${solicitud.estado}</p>
          <p><strong>Prioridad:</strong> ${solicitud.prioridad}</p>
        `;

        contenedor.appendChild(divSolicitud);
      });
    })
    .catch(error => {
      console.error('Error cargando solicitudes:', error);
      document.querySelector('.lista-tareas').innerHTML = '<p>Error al cargar solicitudes.</p>';
    });
}
