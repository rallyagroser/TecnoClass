// Crear superadmin si no existe
if (!localStorage.getItem("usuarios")) {
  const superadmin = [
    {
      nombre: "Super Administrador",
      email: "superadmin@correo.com",
      password: "admin123",
      rol: "superadmin"
    }
  ];
  localStorage.setItem("usuarios", JSON.stringify(superadmin));
}

// Lógica de login
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuario = usuarios.find(
    u => u.email === email && u.password === password
  );

  if (usuario) {
    localStorage.setItem("sesionActiva", JSON.stringify(usuario));
    alert(`¡Bienvenido, ${usuario.nombre}!`);

    if (usuario.rol === "superadmin") {
      window.location.href = "superadmin.html"; // Reemplaza por tu página real
    } else {
      alert("No tienes permisos para acceder.");
    }
  } else {
    alert("Correo o contraseña incorrectos.");
  }
});
