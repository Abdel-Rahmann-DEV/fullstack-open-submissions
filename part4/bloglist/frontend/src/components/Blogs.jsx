import Blog from './Blog';

const Blogs = ({ username, blogs, handleLogOut, showNotification, userBlogs, deleteBlog, addLike }) => {
   return (
      <div >
         {username} logged in <button onClick={handleLogOut}>logout</button>
         <div className="blogs-cont">
            {blogs.map((e) => (
               <Blog key={e._id} blog={e} showNotification={showNotification} userBlogs={userBlogs} deleteBlog={deleteBlog} addLike={addLike} />
            ))}
         </div>
      </div>
   );
};

export default Blogs;
