import axios from 'axios';

const API_KEY = 'b399bbc2-3b1b-4344-8187-65405db4f31e';
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api';

const $api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-KEY': API_KEY,
    'Content-Type': 'application/json',
  },
});

export const kinopoiskApi = {
  getPopularMovies: async (page = 1) => {
    const response = await $api.get('/v2.2/films/collections', {
      params: { type: 'TOP_POPULAR_ALL', page: page },
    });
    return response.data; 
  },

  searchMovies: async (query, page = 1) => {
    const response = await $api.get('/v2.1/films/search-by-keyword', {
      params: { keyword: query, page: page },
    });
    return response.data;
  },

  getMovieDetails: async (filmId) => {
    const response = await $api.get(`/v2.2/films/${filmId}`);
    return response.data;
  },

  getMovieTrailers: async (filmId) => {
    const response = await $api.get(`/v2.2/films/${filmId}/videos`);
    return response.data.items; 
  }
};