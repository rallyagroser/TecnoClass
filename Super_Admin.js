function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(sec => sec.classList.remove('activa'));

  const activa = document.getElementById(id);
  if (activa) activa.classList.add('activa');
}

function toggleMenu() {
  const menu = document.getElementById('menuLateral');
  menu.classList.toggle('oculto');
}

function entrarDashboard() {
  document.getElementById('inicio').classList.add('oculto');
  document.getElementById('encabezado').classList.remove('oculto');
  document.getElementById('contenedorDashboard').classList.remove('oculto');
}

function volverInicio() {
  document.getElementById('inicio').classList.remove('oculto');
  document.getElementById('encabezado').classList.add('oculto');
  document.getElementById('contenedorDashboard').classList.add('oculto');
}
// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  // --- CONFIGURACIÓN DE FIREBASE ---
  // ¡IMPORTANTE! Pega aquí la configuración de tu proyecto Firebase.
 const firebaseConfig = {
      apiKey: "AIzaSyBrVGqx561JZal_11QPh-7l6MsF3UGgORg",
      authDomain: "tecnoclass-b80e5.firebaseapp.com",
      projectId: "tecnoclass-b80e5",
      storageBucket: "tecnoclass-b80e5.firebasestorage.app",
      messagingSenderId: "956700635223",
      appId: "1:956700635223:web:aa8bcd9e8e3f99b6943312",
      measurementId: "G-WJ26SZ5Y33"
    };    

  // Inicializar la aplicación de Firebase
  firebase.initializeApp(firebaseConfig);

  // Referencia a la base de datos en tiempo real de Firebase
  const database = firebase.database();

  // --- REFERENCIAS A ELEMENTOS DEL DOM ---
  const menuLateral = document.getElementById('menuLateral');
  const modalUsuario = document.getElementById('modalUsuario');
  const btnAnadirUsuario = document.getElementById('btnAnadirUsuario');
  const cerrarModal = document.querySelector('.cerrar-modal');
  const formUsuario = document.getElementById('formUsuario');
  const modalTitulo = document.getElementById('modalTitulo');
  const tablaUsuariosBody = document.getElementById('tablaUsuarios').querySelector('tbody');

  // --- LÓGICA DEL MODAL ---

  // Abrir modal para añadir un nuevo usuario
  btnAnadirUsuario.addEventListener('click', () => {
    formUsuario.reset(); // Limpia el formulario
    document.getElementById('usuarioId').value = ''; // Limpia el ID oculto
    modalTitulo.textContent = 'Añadir Nuevo Usuario'; // Cambia el título
    document.getElementById('password').required = true; // La contraseña es requerida para usuarios nuevos
    modalUsuario.style.display = 'block'; // Muestra el modal
  });

  // Cerrar modal al hacer clic en la 'X'
  cerrarModal.addEventListener('click', () => {
    modalUsuario.style.display = 'none';
  });

  // Cerrar modal si se hace clic fuera de él
  window.addEventListener('click', (e) => {
    if (e.target == modalUsuario) {
      modalUsuario.style.display = 'none';
    }
  });


  // --- LÓGICA DE FIREBASE (CRUD) ---

  // Manejar el envío del formulario para AÑADIR o ACTUALIZAR un usuario
  formUsuario.addEventListener('submit', (e) => {
    e.preventDefault(); // Previene que la página se recargue

    // Obtiene el ID del usuario. Si está vacío, es un nuevo usuario.
    const usuarioId = document.getElementById('usuarioId').value;
    
    // Validación del formulario
    if (!validarFormulario(usuarioId)) {
        return; // Detiene la ejecución si la validación falla
    }

    // Recopila los datos del formulario
    const datosUsuario = {
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        rol: document.getElementById('rol').value,
        estado: 'activo' // Por defecto, todos los usuarios nuevos están activos
    };
    
    // Si se está creando un usuario, se añade la contraseña.
    // Para la actualización, la contraseña se maneja por separado (generalmente el usuario la cambia).
    if (!usuarioId) {
        datosUsuario.password = document.getElementById('password').value;
    }

    if (usuarioId) {
      // Si hay un ID, ACTUALIZAMOS el usuario existente
      actualizarUsuario(usuarioId, datosUsuario);
    } else {
      // Si no hay ID, AÑADIMOS un nuevo usuario
      anadirUsuario(datosUsuario);
    }
  });

  /**
   * Valida los campos del formulario antes de enviarlos.
   * @param {string} usuarioId - El ID del usuario. Si existe, no se valida la contraseña.
   * @returns {boolean} - True si el formulario es válido, false en caso contrario.
   */
  function validarFormulario(usuarioId = null) {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    if (!username || !email || !rol) {
        alert('Por favor, rellene todos los campos obligatorios: Nombre de usuario, Correo y Rol.');
        return false;
    }
    
    // La contraseña solo es obligatoria si es un usuario nuevo
    if (!usuarioId && !password) {
        alert('Por favor, ingrese una contraseña.');
        return false;
    }
      
    if (!usuarioId && password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return false;
    }
      
    return true; // Si todo está correcto
  }


  /**
   * Añade un nuevo usuario a la base de datos de Firebase.
   * @param {object} datosUsuario - El objeto con la información del usuario.
   */
  function anadirUsuario(datosUsuario) {
    // Genera una nueva clave única para el usuario
    const nuevoUsuarioRef = database.ref('usuarios').push();
    
    nuevoUsuarioRef.set(datosUsuario)
      .then(() => {
        alert('¡Usuario añadido correctamente!');
        formUsuario.reset();
        modalUsuario.style.display = 'none';
        cargarUsuarios(); // Recarga la tabla de usuarios
      })
      .catch((error) => {
        console.error('Error al añadir el usuario:', error);
        alert('Error al añadir el usuario. Por favor, intente de nuevo.');
      });
  }

  /**
   * Carga y muestra todos los usuarios desde Firebase en la tabla.
   */
  window.cargarUsuarios = function() {
    const usuariosRef = database.ref('usuarios');
    
    usuariosRef.on('value', (snapshot) => {
      tablaUsuariosBody.innerHTML = ''; // Limpia la tabla antes de llenarla
      const data = snapshot.val();
      
      if (!data) {
        tablaUsuariosBody.innerHTML = '<tr><td colspan="5">No hay usuarios registrados.</td></tr>';
        return;
      }
      
      // Itera sobre cada usuario y lo añade a la tabla
      for (const usuarioId in data) {
        const usuario = data[usuarioId];

        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${usuario.username}</td>
          <td>${usuario.email}</td>
          <td>${usuario.rol}</td>
          <td>
            <span class="${usuario.estado === 'activo' ? 'activo' : 'inactivo'}">${usuario.estado}</span>
          </td>
          <td>
            <button class="btn-accion btn-editar" data-id="${usuarioId}">Editar</button>
            <button class="btn-accion ${usuario.estado === 'activo' ? 'btn-desactivar' : 'btn-activar'}" data-id="${usuarioId}">
              ${usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
            </button>
          </td>
        `;
        tablaUsuariosBody.appendChild(fila);
      }
    });
  }

  // --- MANEJO DE ACCIONES EN LA TABLA (EDITAR Y DESACTIVAR/ACTIVAR) ---
  tablaUsuariosBody.addEventListener('click', (e) => {
    const target = e.target;
    const usuarioId = target.getAttribute('data-id');

    if (!usuarioId) return;

    if (target.classList.contains('btn-editar')) {
        abrirModalParaEditar(usuarioId);
    }
    
    if (target.classList.contains('btn-desactivar')) {
        cambiarEstadoUsuario(usuarioId, 'inactivo');
    }
    
    if (target.classList.contains('btn-activar')) {
        cambiarEstadoUsuario(usuarioId, 'activo');
    }
  });

  /**
   * Abre el modal con los datos de un usuario para su edición.
   * @param {string} usuarioId - El ID del usuario a editar.
   */
  function abrirModalParaEditar(usuarioId) {
    const usuarioRef = database.ref('usuarios/' + usuarioId);
    
    usuarioRef.once('value', (snapshot) => {
      const usuario = snapshot.val();
      
      // Llena el formulario con los datos del usuario
      modalTitulo.textContent = 'Editar Usuario';
      document.getElementById('usuarioId').value = usuarioId;
      document.getElementById('username').value = usuario.username;
      document.getElementById('email').value = usuario.email;
      document.getElementById('rol').value = usuario.rol;
      // La contraseña no se muestra por seguridad. Se deja vacía.
      document.getElementById('password').required = false; // No es obligatorio cambiar la contraseña al editar
      
      modalUsuario.style.display = 'block';
    });
  }
  
  /**
   * Actualiza los datos de un usuario en Firebase.
   * @param {string} usuarioId - El ID del usuario a actualizar.
   * @param {object} datosUsuario - Los nuevos datos del usuario.
   */
  function actualizarUsuario(usuarioId, datosUsuario) {
    // No queremos sobreescribir el estado al actualizar otros datos
    delete datosUsuario.estado; 
    
    database.ref('usuarios/' + usuarioId).update(datosUsuario)
      .then(() => {
        alert('Usuario actualizado correctamente.');
        modalUsuario.style.display = 'none';
        cargarUsuarios();
      })
      .catch((error) => {
        console.error('Error al actualizar:', error);
        alert('Hubo un error al actualizar el usuario.');
      });
  }

  /**
   * Cambia el estado de un usuario (activo/inactivo).
   * @param {string} usuarioId - El ID del usuario.
   * @param {string} nuevoEstado - El nuevo estado ('activo' o 'inactivo').
   */
  function cambiarEstadoUsuario(usuarioId, nuevoEstado) {
    const confirmacion = confirm(`¿Estás seguro de que deseas ${nuevoEstado === 'activo' ? 'activar' : 'desactivar'} a este usuario?`);
    if (confirmacion) {
        database.ref('usuarios/' + usuarioId + '/estado').set(nuevoEstado)
            .then(() => {
                alert(`Usuario ${nuevoEstado} correctamente.`);
                cargarUsuarios();
            })
            .catch(error => {
                console.error('Error al cambiar estado:', error);
                alert('Error al cambiar el estado del usuario.');
            });
    }
  }

}); // Fin de DOMContentLoaded


// --- FUNCIONES GLOBALES (ya existentes en tu código) ---
// Las exponemos al objeto window para que puedan ser llamadas desde el HTML (onclick).

function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(sec => sec.classList.remove('activa'));

  const activa = document.getElementById(id);
  if (activa) activa.classList.add('activa');
}

function toggleMenu() {
  const menu = document.getElementById('menuLateral');
  menu.classList.toggle('oculto');
}