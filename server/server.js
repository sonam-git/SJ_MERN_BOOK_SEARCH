/* Note : uncomment the routes variable and comment apolloserver/gql related to start with RESTful API */
// import required packages
const express = require('express');
const path = require('path');
const {ApolloServer} = require('apollo-server-express');
const {typeDefs, resolvers} = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;

// create a new instance of ApolloServer,
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// initialize app
const app = express();

// body parser middlewares (require for Graphql to work)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// initializes the ApolloServer and performs any necessary setup operations.
const startServer = async (typeDefs, resolvers) => {
  await server.start();
  // to forward any GQL request in our express server
  server.applyMiddleware({ app });
  // method to listen for the 'open' event, 
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};
// start the server and begin listening for incoming requests. 
startServer(typeDefs, resolvers);

