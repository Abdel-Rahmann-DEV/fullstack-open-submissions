import Blog from './Blog';
import { useSelector } from 'react-redux';
const Blogs = () => {
   const blogs = useSelector((state) => state.blogs.data);
   return (
      <div>
         <div className='blogs-cont'>
            {blogs.map((e) => (
               <Blog key={e.id} blog={e} />
            ))}
         </div>
      </div>
   );
};

export default Blogs;
