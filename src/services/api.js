import axios from 'axios';

// mock API: json-server --watch database.json --port 9000
const api = axios.create({
  baseURL: 'http://localhost:9000',
});

export default api;
