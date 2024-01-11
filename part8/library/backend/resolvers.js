const Book = require('./modules/book');
const Author = require('./modules/author');
const User = require('./modules/user');
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./utils/config');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const resolvers = {
   Query: {
      bookCount: () => Book.countDocuments(),
      authorCount: () => Author.countDocuments(),
      allBooks: async (_, args) => {
         const query = args.genre ? { genres: { $in: args.genre } } : {};
         const books = await Book.find(query).populate('author');
         return books;
      },
      allAuthors: async () => {
         const authors = await Author.find({});
         return authors;
      },
      me: async (_, args, { currentUser }) => {
         return currentUser || null;
      },
   },
   Mutation: {
      addBook: async (_, args, { currentUser }) => {
         const { title, author, published, genres } = args;

         // Check if user is authenticated
         if (!currentUser) {
            throw new GraphQLError('Not authenticated', {
               extensions: { code: 'UNAUTHORIZED' },
            });
         }

         try {
            let authorId;
            const currentAuthor = await Author.findOne({ name: author });
            currentAuthor.bookCount = currentAuthor.bookCount + 1;
            await currentAuthor.save();
            if (!currentAuthor) {
               const newAuthor = await Author.create({ name: author });
               newAuthor.bookCount = newAuthor.bookCount + 1;
               authorId = newAuthor._id;
               await newAuthor.save();
            } else {
               authorId = currentAuthor._id;
            }

            const newBook = new Book({
               title,
               author: authorId,
               published,
               genres,
            });

            await newBook.save();
            await newBook.populate('author');
            pubsub.publish('BOOK_ADDED', { bookAdded: newBook });
            return newBook;
         } catch (err) {
            handleValidationError(err);
         }
      },
      createUser: async (_, args) => {
         const { username, favoriteGenre } = args;
         const user = new User({ username, favoriteGenre });

         return user.save().catch((error) => {
            handleValidationError(error);
         });
      },
      login: async (_, args) => {
         const user = await User.findOne({ username: args.username });

         if (!user || args.password !== 'secret') {
            throw new GraphQLError('Wrong credentials', {
               extensions: { code: 'BAD_USER_INPUT' },
            });
         }

         const userForToken = {
            username: user.username,
            id: user._id,
         };

         return { value: jwt.sign(userForToken, JWT_SECRET) };
      },
      editAuthor: async (_, args, { currentUser }) => {
         const { id, born } = args;
         if (!currentUser) {
            throw new GraphQLError('Not authenticated', {
               extensions: { code: 'UNAUTHORIZED' },
            });
         }
         const author = await Author.findById(id);
         author.born = born;
         await author.save();
         return author;
      },
   },
   Subscription: {
      bookAdded: {
         subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
      },
   },
};

const handleValidationError = (error) => {
   if (error instanceof mongoose.Error.ValidationError) {
      const fieldErrors = Object.keys(error.errors).map((field) => ({
         field,
         message: error.errors[field].message,
      }));

      throw new GraphQLError('Validation error', {
         extensions: { code: 'BAD_USER_INPUT', fieldErrors },
      });
   } else if (error.name === 'MongoError' && error.code === 11000) {
      throw new GraphQLError('Resource with this value already exists', {
         extensions: { code: 'BAD_USER_INPUT' },
      });
   } else {
      throw new GraphQLError('Invalid input', {
         extensions: { code: 'BAD_USER_INPUT' },
      });
   }
};

module.exports = resolvers;
