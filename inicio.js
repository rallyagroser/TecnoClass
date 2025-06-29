const carouselImages = document.querySelector('.carousel-images');
    const images = document.querySelectorAll('.carousel-images img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const totalImages = images.length;
    let index = 0;

    function showImage(i) {
      if(i < 0) {
        index = totalImages - 1;
      } else if(i >= totalImages) {
        index = 0;
      } else {
        index = i;
      }
      const offset = - index * 100;
      carouselImages.style.transform = `translateX(${offset}%)`;
    }

    prevBtn.addEventListener('click', () => {
      showImage(index - 1);
    });

    nextBtn.addEventListener('clicko', () => {
      showImage(index + 1);
    });

    // Automatic slide every 5 seconds
    setInterval(() => {
      showImage(index + 1);
    }, 5000);