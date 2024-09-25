import axios from 'axios';
//API runs in port 3000, consider this for all services.js
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export default axios.create({
  baseURL: apiUrl,
  //'https://barhand-api.herokuapp.com/api/v1',
  headers: { 'Content-type': 'application/json' }
});
