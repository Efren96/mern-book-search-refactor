const { gql } = require('apollo-server-express');

const typeDefs = gql `
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    password: String
    savedBooks: [Book]!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Book{
    bookId: ID!
    authors: [String]
    description: String
    title: String 
    image: String
    link: String
  }

  input InputBook{
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(newBook: InputBook!: User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;