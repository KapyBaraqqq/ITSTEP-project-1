const DEFAULT_BG = '#101010';

function setAmbientColor(color) {
  document.documentElement.style.setProperty('--ambient-color', color);
  document.body.style.backgroundColor = color;
}

document.addEventListener('DOMContentLoaded', () => {
  setAmbientColor(DEFAULT_BG);

  const cards = document.querySelectorAll('.movie-card[data-color]');
  cards.forEach((card) => {
    card.addEventListener('mouseover', () => {
      const color = card.getAttribute('data-color') || DEFAULT_BG;
      setAmbientColor(color);
    });

    card.addEventListener('mouseout', () => {
      setAmbientColor(DEFAULT_BG);
    });
  });
});

