import axios from 'axios';

export const apiService = axios.create({ responseType: 'json' });

// If you need interceptors, make them here