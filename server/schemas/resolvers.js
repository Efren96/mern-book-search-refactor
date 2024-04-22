const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                data = await User.findOne({ _id: context.user._id }).select('-__v -password');
                return data;
            }
            throw new AuthenticationError('Log in please!')
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
                throw AuthenticationError('User not found.');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError('Incorrect password.');
            }

            const token = signToken(user);
            return { token, user };
        },

        // Add a third argument to the resolver to access data in our `context`
        saveBook: async (parent, { newBook }, context) => {
            // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: newBook }},
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                return updatedUser;
            }
            // If user attempts to execute this mutation and isn't logged in, throw an error
            throw AuthenticationError('Log in please!');
        },
        // Set up mutation so a logged in user can only remove their profile and no one else's
        // Make it so a logged in user can only remove a skill from their own profile
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId }}},
                    { new: true }
                );
                return updatedUser
            }
            throw AuthenticationError('Login required.');
        },
    },
};

module.exports = resolvers;