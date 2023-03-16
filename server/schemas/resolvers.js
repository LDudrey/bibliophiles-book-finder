const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('books');
            }
            console.log(context)
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id  },
                { $addToSet: { bookId, authors, description, title, image, link  } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        },
        deleteBook: async (parent, { bookId }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                throw new AuthenticationError('No user with this id');
            }
            return updatedUser;
        }
    },
}

module.exports = resolvers;