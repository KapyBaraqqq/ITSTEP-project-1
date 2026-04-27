import { kinopoiskApi } from './kinopoiskApi.js';

function initRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (!modal) return;

  const openBtn = document.getElementById('openRegisterBtn');
  const closeEls = modal.querySelectorAll('[data-auth-close]');
  const dialog = modal.querySelector('.auth-modal__dialog');
  const form = document.getElementById('registerForm');

  function open() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    firstInput?.focus?.();
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    openBtn?.focus?.();
  }

  openBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.location.hash !== '#register') window.location.hash = 'register';
    open();
  });

  closeEls.forEach((el) => el.addEventListener('click', close));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  dialog?.addEventListener('click', (e) => e.stopPropagation());

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const password = String(fd.get('password') || '');
    const confirm = String(fd.get('passwordConfirm') || '');
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    alert('Account created (demo)');
    form.reset();
    close();
  });

  if (window.location.hash === '#register') open();
}

function renderMovies(movieData) {
  const app = document.getElementById('app');
  
  let movieGrid = document.getElementById('movieGrid');
  if (!movieGrid) {
    movieGrid = document.createElement('div');
    movieGrid.id = 'movieGrid';
    movieGrid.style.display = 'grid';
    movieGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    movieGrid.style.gap = '20px';
    movieGrid.style.marginTop = '20px';
    app.appendChild(movieGrid);
  }

  movieGrid.innerHTML = '';

  const films = movieData.items || movieData.films || movieData;

  if (!films || films.length === 0) {
    app.innerHTML = '<p style="color: white;">Фильмы не найдены</p>';
    return;
  }

  films.forEach(movie => {
    const poster = movie.posterUrl || movie.posterUrlPreview || 'https://via.placeholder.com/300x450?text=No+Poster';
    const title = movie.nameRu || movie.nameEn || 'Без названия';
    const rating = movie.ratingKinopoisk || movie.rating || '?';
    const year = movie.year || 'Неизвестно';
    const filmId = movie.filmId || movie.kinopoiskId;

    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${poster}" alt="${title}" style="width:100%; border-radius:8px; aspect-ratio: 2/3; object-fit: cover;">
      <h3>${title} (${year})</h3>
      <p>⭐ ${rating}</p>
      <button class="details-btn" data-id="${filmId}">Трейлер</button>
    `;
    movieGrid.appendChild(card);
  });

  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const filmId = e.target.dataset.id;
      try {
        const trailers = await kinopoiskApi.getMovieTrailers(filmId);
        const youTubeTrailer = trailers.find(t => t.site === 'YOUTUBE');
        if (youTubeTrailer) {
          window.open(`https://www.youtube.com/watch?v=${youTubeTrailer.url}`, '_blank');
        } else {
          alert('Трейлер не найден на YouTube');
        }
      } catch (error) {
        console.error('Ошибка загрузки трейлера', error);
        alert('Не удалось загрузить трейлер');
      }
    });
  });
}

async function loadPopularMovies() {
  try {
    const app = document.getElementById('app');
    if (!app) {
      console.error('Элемент с id="app" не найден в HTML!');
      return;
    }
    
    app.innerHTML = '<p style="color: white;">Загрузка фильмов...</p>';
    
    const data = await kinopoiskApi.getPopularMovies(1);
    console.log('Полученные данные:', data);
    
    renderMovies(data);
  } catch (error) {
    console.error('Ошибка загрузки фильмов:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '<p style="color: red;">Ошибка загрузки. Проверьте консоль и токен.</p>';
    }
  }
}

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.pre-btn');

  if (!slides.length || !nextBtn || !prevBtn) {
    console.log('Слайдер не инициализирован: не найдены элементы');
    return;
  }

  let currentIndex = 0;

  function showSlide(index) {
    slides[currentIndex].classList.remove('slide-active');
    
    if (index >= slides.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = slides.length - 1;
    } else {
      currentIndex = index;
    }
    
    slides[currentIndex].classList.add('slide-active');
  }

  nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
  prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Страница загружена, запускаем...');
  initRegisterModal();
  loadPopularMovies();
  initSlider();
});