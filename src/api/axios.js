import axios from 'axios';

// Create an Axios instance with base URL and credentials configuration
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Our Express backend
    withCredentials: true, // IMPORTANT: Allows cookies (like our session cookie) to be sent with requests
});

export default api;
