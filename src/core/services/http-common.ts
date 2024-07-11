import axios from 'axios';
//API runs in port 3000, consider this for all services.js
export default axios.create({
  baseURL: 'http://127.0.0.1:8000',
  //'https://barhand-api.herokuapp.com/api/v1',
  headers: { 'Content-type': 'application/json' }
});
