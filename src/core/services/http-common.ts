import axios from 'axios';
//API runs in port 3000, consider this for all services.js
const apiUrl = process.env.API_URL || 'http://localhost:8080';
console.log('result', import.meta.env.VITE_API_URL);

console.log('API_URL:', apiUrl);
console.log('API_URL2:', process.env.API_URL);
export default axios.create({
  baseURL: apiUrl,
  //'https://barhand-api.herokuapp.com/api/v1',
  headers: { 'Content-type': 'application/json' }
});
