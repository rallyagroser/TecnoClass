// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBrVGqx561JZal_11QPh-7l6MsF3UGgORg",
  authDomain: "tecnoclass-b80e5.firebaseapp.com",
  projectId: "tecnoclass-b80e5",
  storageBucket: "tecnoclass-b80e5.appspot.com",
  messagingSenderId: "956700635223",
  appId: "1:956700635223:web:aa8bcd9e8e3f99b6943312",
  measurementId: "G-WJ26SZ5Y33"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Manejo del login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener datos del usuario en Firestore
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const datos = docSnap.data();
      alert(`¡Bienvenido, ${datos.nombre || email}!`);

      // Puedes guardar el rol temporalmente si deseas
      sessionStorage.setItem('rol', datos.rol);
      sessionStorage.setItem('nombre', datos.nombre || email);

      // Redireccionar por rol
      if (datos.rol === "Administrador") {
        window.location.href = "principal.html";
      } else if (datos.rol === "admin") {
        window.location.href = "panel_admin.html";
      } else {
        window.location.href = "panel_alumno.html";
      }

    } else {
      alert("Inicio de sesión exitoso, pero no se encontraron datos del usuario en Firestore.");
    }

  } catch (error) {
    console.error("Error al iniciar sesión:", error.code, error.message);
    alert("Correo o contraseña incorrectos.");
  }
});
