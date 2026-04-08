import axios from 'axios';

// 1. ВСТАВЬТЕ ВАШ РЕАЛЬНЫЙ ТОКЕН СЮДА
const API_KEY = 'b399bbc2-3b1b-4344-8187-65405db4f31e';
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api';

// 2. Настраиваем axios: он будет автоматически подставлять базовый адрес и ваш ключ в заголовки всех запросов
const $api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-KEY': API_KEY, // Это обязательный заголовок для авторизации
    'Content-Type': 'application/json',
  },
});

// 3. Здесь мы собираем все функции для работы с разными данными
export const kinopoiskApi = {
  // --- Получить популярные фильмы (для главной страницы) ---
  getPopularMovies: async (page = 1) => {
    // Используем коллекцию "ТОП ПОПУЛЯРНЫХ ВСЕХ ВРЕМЕН"
    const response = await $api.get('/v2.2/films/collections', {
      params: { type: 'TOP_POPULAR_ALL', page: page },
    });
    // API возвращает объект, внутри которого в поле 'items' лежит массив фильмов
    return response.data; 
  },

  // --- Поиск фильмов по названию ---
  searchMovies: async (query, page = 1) => {
    const response = await $api.get('/v2.1/films/search-by-keyword', {
      params: { keyword: query, page: page },
    });
    // Здесь массив фильмов лежит в поле 'films'
    return response.data;
  },

  // --- Получить детальную информацию об одном фильме по его ID ---
  getMovieDetails: async (filmId) => {
    const response = await $api.get(`/v2.2/films/${filmId}`);
    return response.data;
  },

  // --- Получить список трейлеров и видео для фильма ---
  getMovieTrailers: async (filmId) => {
    const response = await $api.get(`/v2.2/films/${filmId}/videos`);
    // Список видео лежит в поле 'items'
    return response.data.items; 
  }
};