import React from 'react';
import { Link } from 'react-router-dom';

const Blog = React.memo(({ blog }) => {
   const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5,
   };

   return (
      <div className='blog' style={blogStyle}>
         <Link to={`/blogs/${blog.id}`}>
            <p className='title'>{blog.title}</p>
         </Link>
      </div>
   );
});
Blog.displayName = 'Blog';
export default Blog;
