const { GraphQLError } = require('graphql');
const Person = require('./modules/person');
const User = require('./modules/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./utils/config');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const resolvers = {
   Query: {
      personCount: async () => Person.collection.countDocuments(),
      allPersons: async (root, args) => {
         if (!args.phone) {
            return Person.find({}).populate('friendOf');
         }
         return Person.find({ phone: { $exists: args.phone === 'YES' } }).populate('friendOf');
      },
      allUsers: async () => {
         return User.find({});
      },
      findPerson: async (root, args) => Person.findOne({ name: args.name }),
      me: async (_, args, context) => {
         return context.currentUser;
      },
   },
   Person: {
      address: (root) => {
         return {
            street: root.street,
            city: root.city,
         };
      },
   },
   Mutation: {
      addPerson: async (root, args, context) => {
         console.log(args);
         const person = new Person({ ...args });
         const { currentUser } = context;

         if (!currentUser) {
            throw new GraphQLError('not authenticated', {
               extensions: {
                  code: 'BAD_USER_INPUT',
               },
            });
         }

         try {
            await person.save();
            currentUser.friends = currentUser.friends.concat(person);
            await currentUser.save();
            console.log('Person saved successfully:', person);
         } catch (error) {
            console.error('Error saving person:', error);
            throw new GraphQLError('Saving person failed', {
               extensions: {
                  code: 'BAD_USER_INPUT',
                  invalidArgs: args.name,
                  error,
               },
            });
         }
         pubsub.publish('PERSON_ADDED', { personAdded: person });
         return person;
      },

      editNumber: async (root, args) => {
         const person = await Person.findOne({ name: args.name });
         person.phone = args.phone;
         try {
            await person.save();
         } catch (error) {
            throw new GraphQLError('Saving number failed', {
               extensions: {
                  code: 'BAD_USER_INPUT',
                  invalidArgs: args.name,
                  error,
               },
            });
         }
         return person.save();
      },
      createUser: async (root, args) => {
         const user = new User({ username: args.username });

         return user.save().catch((error) => {
            throw new GraphQLError('Creating the user failed', {
               extensions: {
                  code: 'BAD_USER_INPUT',
                  invalidArgs: args.username,
                  error,
               },
            });
         });
      },
      login: async (root, args) => {
         const user = await User.findOne({ username: args.username });

         if (!user || args.password !== 'secret') {
            throw new GraphQLError('wrong credentials', {
               extensions: {
                  code: 'BAD_USER_INPUT',
               },
            });
         }

         const userForToken = {
            username: user.username,
            id: user._id,
         };

         return { value: jwt.sign(userForToken, JWT_SECRET) };
      },
      addAsFriend: async (root, args, { currentUser }) => {
         const isFriend = (person) => currentUser.friends.map((f) => f._id.toString()).includes(person._id.toString());

         if (!currentUser) {
            throw new GraphQLError('wrong credentials', {
               extensions: { code: 'BAD_USER_INPUT' },
            });
         }

         const person = await Person.findOne({ name: args.name });
         if (!isFriend(person)) {
            currentUser.friends = currentUser.friends.concat(person);
         }

         await currentUser.save();

         return currentUser;
      },
   },
   Subscription: {
      personAdded: {
         subscribe: () => pubsub.asyncIterator('PERSON_ADDED'),
      },
   },
};

module.exports = resolvers;
