require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { MONGODB_URI, JWT_SECRET } = require('./utils/config');
const mongoose = require('mongoose');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');
const User = require('./modules/user');
const typeDefs = require('./schema');

const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const cors = require('cors');
const http = require('http');

mongoose.set('strictQuery', false);
mongoose
   .connect(MONGODB_URI)
   .then(() => {
      console.log('connected to MongoDB');
   })
   .catch((error) => {
      console.log('error connection to MongoDB:', error.message);
   });
mongoose.set('debug', true);

const start = async () => {
   const app = express();
   const httpServer = http.createServer(app);

   const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/',
   });

   const schema = makeExecutableSchema({ typeDefs, resolvers });
   const serverCleanup = useServer({ schema }, wsServer);

   const server = new ApolloServer({
      schema,
      plugins: [
         ApolloServerPluginDrainHttpServer({ httpServer }),
         {
            async serverWillStart() {
               return {
                  async drainServer() {
                     await serverCleanup.dispose();
                  },
               };
            },
         },
      ],
   });

   await server.start();

   app.use(
      '/',
      cors(),
      express.json(),
      expressMiddleware(server, {
         context: async ({ req }) => {
            const auth = req ? req.headers.authorization : null;

            if (auth && auth.startsWith('Bearer ')) {
               const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
               const currentUser = await User.findById(decodedToken.id)
               console.log('run......');
               return { currentUser };
            }
            return {};
         },
      })
   );

   const PORT = 4000;

   httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`));
};

start();
