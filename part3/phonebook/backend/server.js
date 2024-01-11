require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person'); // Person Module
const { posts } = require('./resolvers');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Define your schema
const schema = buildSchema(`
type Post {
   userId: Int
   id: Int
   title: String
   body: String
}

   type RootQuery {
      postsCount: Int!
      posts: [Post]
      findPost(id: String!): Post
   }
   
   schema {
      query: RootQuery
   }
   `);
const root = {
   posts: () => posts,
};

const app = express();
//= ===================================
// Middleware Config
//= ===================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('dist'));

app.use(
   '/graphql',
   graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true, // Enable the GraphiQL interface for testing in the browser
   })
);

morgan.token('req-body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

//= ===================================
// Routes
//= ===================================
app.get('/api/persons', (req, res) => {
   Person.find({}).then((persons) => res.json(persons));
});
app.get('/api/persons/:id', (req, res, next) => {
   const { id } = req.params;
   Person.findById(id)
      .then((person) => res.status(200).json(person))
      .catch((err) => next(err));
});
app.delete('/api/persons/:id', (req, res) => {
   const { id } = req.params;
   Person.findOneAndDelete(id)
      .then(() => res.status(200).json({ status: 'success' }))
      .catch(() => res.status(404).end());
});
app.post('/api/persons', async (req, res, next) => {
   try {
      const { name, number } = req.body;

      if (!name || !number) {
         return res.status(400).json({ status: 'error', message: 'The name or number is missing' });
      }

      const existingPerson = await Person.findOne({ name });

      if (existingPerson) {
         return res.status(409).json({ status: 'error', message: 'The name already exists in the phonebook' });
      }

      const newPerson = new Person({ name, number });
      const savedPerson = await newPerson.save();
      return res.status(201).json(savedPerson);
   } catch (error) {
      return next(error);
   }
});
app.patch('/api/persons/:id', (req, res) => {
   const { id } = req.params;
   const { number } = req.body;

   if (!number) {
      return res.status(404).json({ status: 'error' }).end();
   }

   return Person.findByIdAndUpdate(id, { number }, { new: true, runValidators: true, context: 'query' })
      .then((newPerson) => res.status(200).json(newPerson))
      .catch((err) => res.status(404).json({ status: 'error', message: err.message }).end());
});

app.get('/info', (req, res) => {
   Person.countDocuments({})
      .then((count) => {
         const currTime = getCurrTime();
         res.status(200).send(`<p>Phonebook has info for ${count} people</p> <br /> <p>${currTime}</p>`);
      })
      .catch(() => res.status(404).end());
});

//= ===================================
// Error Handleing Middleware
//= ===================================
const errorHandler = (err, req, res) => {
   const statusCode = err.statusCode || 500;
   if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
   }

   return res.status(statusCode).json({
      status: 'error',
      message: err.message || 'Internal Server Error',
   });
};
app.use(errorHandler);

//= ===================================
// Start Server
//= ===================================
const { PORT } = process.env;
app.listen(PORT, () => {
   console.log(`server run in port ${PORT}`);
});

//= ===================================
// Utilts Functions
//= ===================================
const getCurrTime = () => {
   const currentDate = new Date();
   const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'long', // Use 'short' for abbreviated time zone name.
   };

   const formatter = new Intl.DateTimeFormat('en-US', options);
   const formattedCurrentDate = formatter
      .formatToParts(currentDate)
      .map((part) => {
         if (part.type === 'timeZoneName') {
            return part.value;
         }
         return part.value;
      })
      .join(' ');
   return formattedCurrentDate;
};
