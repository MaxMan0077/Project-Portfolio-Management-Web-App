import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5001/api'; // Your API base URL
axios.defaults.withCredentials = true; // Ensure credentials are sent with every request

export default axios;