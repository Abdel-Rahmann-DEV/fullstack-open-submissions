import axios from 'axios';

const baseUrl = '/api/login';

const login = async (credentials) => {
   const request = axios.post(baseUrl, credentials);
   const response = await request;
   console.log(response);
   return response.data;
};

export default { login };
