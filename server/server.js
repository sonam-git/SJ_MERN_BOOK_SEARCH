// import required packages
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

// initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// create a new instance of ApolloServer,
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});


// body parser middlewares (require for Graphql to work)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/build");
app.use(express.static(buildPath));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// initializes the ApolloServer and performs any necessary setup operations.
const startServer = async () => {
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
startServer();

