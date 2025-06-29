// Selecciona el formulario del DOM.
  const form = document.getElementById('registrationForm');

  // Agrega un evento 'submit' al formulario para procesar el registro.
  form.addEventListener('submit', e => {
    // Previene el comportamiento por defecto del formulario (que es recargar la página).
    e.preventDefault();

    // Elimina clases de error previas para una validación limpia en cada intento.
    [...form.elements].forEach(el => el.classList.remove('input-error'));

    // --- CAPTURA Y VALIDACIÓN DE DATOS ---

    const username = form.username.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Validación 1: Nombre de usuario debe tener al menos 3 caracteres.
    if (username.length < 3) {
      showError(form.username, 'El nombre de usuario debe tener al menos 3 caracteres.');
      return;
    }

    // Validación 2: El correo debe ser un correo de estudiante.
    if (!email.endsWith('@estudiante.com')) {
        showError(form.email, 'El correo debe ser de estudiante (terminar en @estudiante.com).');
        return;
    }

    // Validación 3: La contraseña debe tener al menos 6 caracteres.
    if (password.length < 6) {
      showError(form.password, 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Validación 4: Las contraseñas deben coincidir.
    if (confirmPassword !== password) {
      showError(form.confirmPassword, 'Las contraseñas no coinciden.');
      return;
    }

    // --- LÓGICA DE ALMACENAMIENTO EN LOCALSTORAGE ---

    // Obtiene la lista de usuarios del localStorage.
    // Si no existe 'users', inicializa un array vacío.
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Validación 5: Verifica si el nombre de usuario ya está en uso.
    if (users.find(user => user.username === username)) {
      showError(form.username, 'Este nombre de usuario ya está registrado.');
      return;
    }

    // Validación 6: Verifica si el correo electrónico ya está en uso.
    if (users.find(user => user.email === email)) {
      showError(form.email, 'Este correo electrónico ya está registrado.');
      return;
    }

    // --- GUARDADO DEL NUEVO USUARIO ---

    // Crea un objeto para el nuevo usuario.
    const newUser = { username, email, password };

    // Agrega el nuevo usuario al array de usuarios.
    users.push(newUser);

    // Guarda el array actualizado de vuelta en el localStorage.
    // JSON.stringify convierte el array de objetos a un string en formato JSON.
    localStorage.setItem('users', JSON.stringify(users));

    // Muestra un mensaje de éxito y reinicia el formulario.
    alert('¡Registro exitoso! Ahora puedes iniciar sesión. ¡Bienvenido a Tecno Class!');
    form.reset();
    window.location.href = 'login.html'
    // Opcional: Redirigir al login después de un registro exitoso.
    // window.location.href = 'login.html';
  });

  // Función para mostrar un mensaje de error y resaltar el campo incorrecto.
  function showError(input, message) {
    input.classList.add('input-error'); // Agrega clase para feedback visual.
    alert(message); // Muestra el mensaje de error.
    input.focus(); // Pone el foco en el campo con el error.
  }

  // Estilos para resaltar el campo con error.
  const style = document.createElement('style');
  style.innerHTML = `
    .input-error {
      animation: shake 0.3s ease;
      border-color: #e61a6b !important;
      box-shadow: 0 0 8px #e61a6b !important;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
    }
  `;
  document.head.appendChild(style);