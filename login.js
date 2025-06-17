document.addEventListener('DOMContentLoaded', function() {
  
  const loginForm = document.getElementById('loginForm');
  // Obtenemos una referencia a la base de datos de Firestore
  const db = firebase.firestore();

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    // 1. AUTENTICAR AL USUARIO
    firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput)
      .then((userCredential) => {
        // Inicio de sesión exitoso
        const user = userCredential.user;
        console.log('Usuario autenticado con UID:', user.uid);

        // 2. BUSCAR EL ROL DEL USUARIO EN FIRESTORE
        // Usamos el UID del usuario para encontrar su documento en la colección "users"
        const userDocRef = db.collection('usuarios').doc(user.uid);

        userDocRef.get().then((doc) => {
          if (doc.exists) {
            // El documento del usuario existe, obtenemos el rol
            const userData = doc.data();
            const role = userData.rol;
            console.log('Rol del usuario:', role);

            alert(`¡Bienvenido de nuevo, ${user.email}!`);

            // 3. REDIRIGIR SEGÚN EL ROL
            switch (role) {
              case 'superadministrador':
                window.location.href = 'Super_Admin.html';
                break;
              case 'administrador':
                // Asegúrate de que exista un archivo Admin.html
                window.location.href = 'Administrador.html'; 
                break;
              case 'alumno':
                // Asegúrate de que exista un archivo Alumno.html
                window.location.href = 'principal.html';
                break;
              default:
                // Si el rol no es ninguno de los esperados
                alert('No tienes un rol válido asignado.');
                firebase.auth().signOut(); // Cierra la sesión por seguridad
            }
          } else {
            // Esto sucede si el usuario está en Authentication pero no en Firestore
            console.error("No se encontró el documento del usuario en Firestore.");
            alert("Error: No se ha asignado un rol a este usuario. Contacta al administrador.");
            firebase.auth().signOut(); // Cierra la sesión
          }
        }).catch((error) => {
          console.error("Error al obtener el documento del usuario:", error);
          alert("Hubo un error al verificar tu rol.");
        });

      })
      .catch((error) => {
        // Manejo de errores de autenticación (usuario no existe, contraseña incorrecta, etc.)
        let errorMessage = "Usuario o contraseña incorrectos.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          errorMessage = "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.";
        }
        console.error("Error de autenticación:", error.code);
        alert(errorMessage);
      });
  });
});