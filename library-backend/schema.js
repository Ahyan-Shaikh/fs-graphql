const typeDefs = /* GraphQL */ `
  #User
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  #Book

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
  }

  #Queries and mutations

  type Query {
    #Book related queries
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]

    #User related queries
    me: User
  }

  type Mutation {
    #Book related mutations
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author

    #User related mutations
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token

    #test
    _resetDatabase: Boolean
  }
`

module.exports = typeDefs
