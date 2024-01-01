import axios from 'axios';

const baseUrl = '/api/users';

const getUserBlogs = async (id) => {
   try {
      const response = await axios.get(`${baseUrl}/userBlogs/${id}`);
      return response.data.blogs;
   } catch (err) {
      console.log(err);
      throw err;
   }
};
const allUsers = async (id) => {
   try {
      const response = await axios.get(baseUrl);
      return response.data;
   } catch (err) {
      console.log(err);
      throw err;
   }
};
const getUserById = async (id) => {
   try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
   } catch (err) {
      console.log(err);
      throw err;
   }
};

const usersServices = {
   getUserBlogs,
   allUsers,
   getUserById,
};

export default usersServices;
