import axios from 'axios';
//API runs in port 3000, consider this for all services.js

export default axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  //'https://barhand-api.herokuapp.com/api/v1',
  headers: { 'Content-type': 'application/json' }
});
