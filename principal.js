// Variables DOM
  const subjectCards = document.querySelectorAll('.subject-card');
  const selectedSubjectDisplay = document.getElementById('selectedSubject');



  // Manejar selección
  subjectCards.forEach(card => {
    card.addEventListener('click', () => {
      selectSubject(card.dataset.subject);
      animateCard(card);
    });
    // Para accesibilidad: permitir "Enter" o "Space"
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectSubject(card.dataset.subject);
        animateCard(card);
      }
    });
  });

  // Función para mostrar detalles materia
  function selectSubject(subject) {
    selectedSubjectDisplay.textContent = subjectDetails[subject] || '';
  }

  // Animar un card seleccionado momentáneamente
  function animateCard(card) {
    card.style.transform = 'scale(1.1) rotate(3deg)';
    card.style.boxShadow = '0 15px 40px rgba(255,184,0,0.9)';
    setTimeout(() => {
      card.style.transform = '';
      card.style.boxShadow = '';
    }, 400);
  }