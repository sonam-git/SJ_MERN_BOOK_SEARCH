// importing necessary packages/models
const { AuthenticationError } = require("apollo-server-express");
const { User} = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (root, args, context) => {
      // resolver function checks if there is a user object in the context
      // assuming context object contains information about the authenticated user, such as their ID.
      if (context.user) {
        // if found one then return the user with the matching ID.
        const userData = await User.findeOne({ _id: context.user._id })
        .select('-__v -password');
        return userData;
      }
      // If there is no user in the context, the resolver throws an
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
     // defines a resolver for the addUser mutation
     addUser: async (root, { username, email, password }) => {
      // create new user in the db
      const user = await User.create({
        username,
        email,
        password,
      });
      // generates a token using the signToken function & assigns it to the token variable.
      const token = signToken(user);
      // return an object containing both token and user
      return { token, user };
    },
    // defines a resolver for the login mutation
    login: async (root, { email, password }) => {
      // check if there is an user with the given email
      const user = await User.findOne({ email });
      // if no user found, throws an error message
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      // if found one, it checks if the provided password matches with user's actual password
      const correctPw = await user.isCorrectPassword(password);
      // if passowrd is incorrect, throws an error message
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      // generates token using signToken function and assigns it to the token varialbe
      const token = signToken(user);
      // return an object containing both token and user
      return { token, user };
    },
    // defines a resolver for the saveBook mutation
    saveBook: async (
      root,
      { bookId, authors, description, title, image, link },
      context
    ) => {
      // checks if there is a user authenticated in the context
      if (context.user) {
        // assigns an empty string as the default value for the description field if it is not provided.
        description = description || " ";
        //  find the user based on the _id
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          // update the savedBooks array by adding a new book object to it.
          {
            $addToSet: {
              savedBooks: { authors, bookId, description, title, image, link },
            },
          },
          // ensures that the updated user object is returned as the result of the mutation.
          { new: true }
        );
      }
      // no authenticated user, it throws an AuthenticationError
      throw new AuthenticationError("You need to be logged in!");
    },
    // defines a resolver for the removeBook mutation
    removeBook: async (root, { bookId }, context) => {
      if (context.user) {
        //  find the user based on the _id
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          // remove a book from the savedBooks
          { $pull: { savedBooks: { bookId } } },
          // ensures that the updated user object is returned as the result of the mutation.
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};
// exports resolvers
module.exports = resolvers;
