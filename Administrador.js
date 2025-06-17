// Administrador.js - Gestión de aulas en una aplicación web
// Función para mostrar u ocultar la sección de aulas
document.querySelector('.opcion-lateral h3').addEventListener('click', () => {
  const seccion = document.getElementById('seccion-aulas');
  seccion.style.display = seccion.style.display === 'none' ? 'block' : 'none';
  mostrarAulas(); // Se actualiza la lista al abrir
});

// Función para guardar una nueva aula en localStorage
function guardarAula(evento) {
  evento.preventDefault(); // Previene recarga del formulario

  // Obtenemos los valores de los campos
  const nombre = document.getElementById('nombreAula').value;
  const grado = document.getElementById('gradoAula').value;
  const seccion = document.getElementById('seccionAula').value;

  // Creamos el objeto aula
  const aula = {
    id: Date.now(), // ID único
    nombre,
    grado,
    seccion
  };

  // Obtenemos las aulas existentes y añadimos la nueva
  const aulas = JSON.parse(localStorage.getItem('aulas')) || [];
  aulas.push(aula);
  localStorage.setItem('aulas', JSON.stringify(aulas)); // Guardamos

  // Limpiamos el formulario y actualizamos la lista
  evento.target.reset();
  mostrarAulas();
}

// Función para mostrar todas las aulas en la interfaz
function mostrarAulas() {
  const contenedor = document.getElementById('listaAulas');
  contenedor.innerHTML = ''; // Limpiamos el contenido anterior

  const aulas = JSON.parse(localStorage.getItem('aulas')) || [];

  if (aulas.length === 0) {
    contenedor.innerHTML = '<p>No hay aulas registradas.</p>';
    return;
  }

  aulas.forEach(aula => {
    const div = document.createElement('div');
    div.style.background = '#444';
    div.style.padding = '10px';
    div.style.marginBottom = '10px';
    div.style.borderRadius = '5px';

    div.innerHTML = `
      <strong>${aula.nombre}</strong> - Grado: ${aula.grado} - Sección: ${aula.seccion}
      <button onclick="eliminarAula(${aula.id})" style="float: right;">Eliminar</button>
    `;

    contenedor.appendChild(div);
  });
}

// Función para eliminar un aula según su ID
function eliminarAula(id) {
  let aulas = JSON.parse(localStorage.getItem('aulas')) || [];
  aulas = aulas.filter(a => a.id !== id); // Filtramos el aula a eliminar
  localStorage.setItem('aulas', JSON.stringify(aulas));
  mostrarAulas(); // Volvemos a mostrar
}

// Asociamos la función de guardar al formulario
document.getElementById('formulario-aula').addEventListener('submit', guardarAula);

