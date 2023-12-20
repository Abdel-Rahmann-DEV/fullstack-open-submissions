import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;

const setToken = (userToken) => {
   token = userToken;
};

const getAll = async () => {
   try {
      const response = await axios.get(baseUrl);
      return response.data;
   } catch (error) {
      console.error('Error fetching blogs:', error.message);
      throw error;
   }
};

const create = async (payload) => {
   try {
      const config = {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      };

      const response = await axios.post(baseUrl, payload, config);
      return response.data;
   } catch (error) {
      console.error('Error creating blog:', error.message);
      throw error;
   }
};
const like = async (id) => {
   try {
      const config = {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      };
      const response = await axios.put(`${baseUrl}/${id}`, {}, config);
      return response.data;
   } catch (err) {
      console.log(err)
      throw err;
   }
};
const deleteBlog = async (id) => {
   try {
      const config = {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      };
      const response = await axios.delete(`${baseUrl}/${id}`, config);
      return response.data;
   } catch (err) {
      console.log(err)
      throw err;
   }
};

const blogService = {
   getAll,
   create,
   setToken,
   like,
   deleteBlog,
};

export default blogService;
