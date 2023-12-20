import axios from 'axios';

const baseUrl = '/api/users';

const userBlog = async (id) => {
   try {
      const response = await axios.get(`${baseUrl}/userBlogs/${id}`);
      return response.data.blogs;
   } catch (err) {
      console.log(err);
      throw err;
   }
};
const blogService = {
   userBlog,
};

export default blogService;
