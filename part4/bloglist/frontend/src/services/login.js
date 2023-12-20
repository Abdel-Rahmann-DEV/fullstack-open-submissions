import axios from 'axios';
const baseUrl = '/api/login';

const login = async (payload) => {
   const request = axios.post(baseUrl, payload);
   const response = await request;
   return response.data;
};

export default { login };
