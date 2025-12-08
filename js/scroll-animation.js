document.addEventListener('DOMContentLoaded', function () {
  
  // SCROLL ANIMATION FOR CARDS_________________________________________________________________________
  function animateCards() {
    const CARDS = document.querySelectorAll('.mini-card');
    
    CARDS.forEach((card, index) => {
      const CARD_POSITION = card.getBoundingClientRect().top;
      const SCREEN_POSITION = window.innerHeight;
      
      if (CARD_POSITION < SCREEN_POSITION) {
        setTimeout(() => {
          card.classList.add('card-visible');
        }, index * 100);
      }
    });
  }

  // Ejecutar al cargar y al hacer scroll
  animateCards();
  window.addEventListener('scroll', animateCards);

});