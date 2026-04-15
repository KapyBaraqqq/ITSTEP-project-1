import './style.css'
import { kinopoiskApi } from './kinopoiskApi.js';

// --- Функция для отрисовки карточек фильмов на странице ---
function renderMovies(movieData) {
  const app = document.getElementById('app');
  
  // Создаем контейнер для фильмов, если его еще нет
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

  movieGrid.innerHTML = ''; // Очищаем сетку перед добавлением новых карточек

  // Определяем, где лежит массив фильмов в полученных данных
  const films = movieData.items || movieData.films || movieData;

  if (!films || films.length === 0) {
    app.innerHTML = '<p style="color: white;">Фильмы не найдены</p>';
    return;
  }

  // Перебираем все фильмы и создаем для каждого HTML-карточку
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

  // Добавляем обработчики событий на все кнопки "Трейлер"
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

// --- Функция для загрузки популярных фильмов при старте ---
async function loadPopularMovies() {
  try {
    const app = document.getElementById('app');
    if (!app) {
      console.error('Элемент с id="app" не найден в HTML!');
      return;
    }
    
    app.innerHTML = '<p style="color: white;">Загрузка фильмов...</p>';
    
    const data = await kinopoiskApi.getPopularMovies(1);
    console.log('Полученные данные:', data); // Проверяем в консоли
    
    renderMovies(data);
  } catch (error) {
    console.error('Ошибка загрузки фильмов:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '<p style="color: red;">Ошибка загрузки. Проверьте консоль и токен.</p>';
    }
  }
}

// --- Код для слайдера ---
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

// --- Запускаем всё при загрузке страницы ---
document.addEventListener('DOMContentLoaded', () => {
  console.log('Страница загружена, запускаем...');
  loadPopularMovies(); // Загружаем фильмы
  initSlider(); // Инициализируем слайдер
});
// Smooth-scroll is handled by anchor links + CSS (see `html { scroll-behavior: smooth; }`)