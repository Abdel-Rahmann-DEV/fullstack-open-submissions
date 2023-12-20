const mongoose = require('mongoose');
const Blog = require('./modules/blog');
const User = require('./modules/user');
const blogs = require('./blogs');

mongoose.connect('mongodb://abdo:abdo@ac-5y7q7ra-shard-00-00.ghyns40.mongodb.net:27017,ac-5y7q7ra-shard-00-01.ghyns40.mongodb.net:27017,ac-5y7q7ra-shard-00-02.ghyns40.mongodb.net:27017/blogApp?ssl=true&replicaSet=atlas-5vqn06-shard-0&authSource=admin&retryWrites=true&w=majority', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
   console.log('Connected to MongoDB');

   const users = [];
   for (let i = 0; i < 20; i++) {
      users.push({ username: `user${i}`, name: `User${i}`, password: 'test' });
   }
   const createUser = async () => {
      try {
         for (let i = 0; i < 20; i++) {
            await User.findOneAndDelete({ username: `user${i}` });
         }
         console.log('Users added!');
      } catch (error) {
         console.log('Error when adding users:', error);
      }
   };

   const addLikes = async () => {
      try {
         for (let i in users) {
            const user = await new User(users[i]);
            await user.save();
            console.log('User', user.username, 'Is Saved');
            const randomNumberOfBlogs = Math.floor(Math.random() * 31);

            for (let j = 0; j < randomNumberOfBlogs; j++) {
               const totalNumberOfBlogs = await Blog.countDocuments();

               if (totalNumberOfBlogs > 0) {
                  const randomBlog = await Blog.findOne().skip(Math.floor(Math.random() * totalNumberOfBlogs));

                  if (randomBlog && randomBlog.usersLikes.indexOf(user._id) === -1) {
                     // User hasn't liked this blog yet
                     // Increment likes and push user ID
                     randomBlog.likes += 1;
                     randomBlog.usersLikes.push(user._id);
                     console.log('User Added Like To', randomBlog.title);
                     // Save the modified blog
                     await randomBlog.save();
                  }
               }
            }
         }
      } catch (err) {
         console.error(err);
      } finally {
         mongoose.connection.close();
      }
   };

   // createUser();
   addLikes();
});
