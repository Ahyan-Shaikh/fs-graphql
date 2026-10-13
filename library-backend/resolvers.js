const { GraphQLError } = require("graphql/error")
const { PubSub } = require("graphql-subscriptions")
const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")

const jwt = require("jsonwebtoken")
const book = require("./models/book")
const pubsub = new PubSub()

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
]

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),

    allBooks: async (root, args) => {
      const books = await Book.find({}).populate("author")
      if (!args.genre && !args.author) {
        return books
      }

      // only returns books by genre as author is not defined
      if (!args.author) {
        return books.filter((b) => b.genres.includes(args.genre))
      }
  
      // only returns books by authors as genre is not defined
      if (!args.genre) {
        return books.filter((b) => b.author.name === args.author)
      }
  
      // returns books by authors with a genre if only exists
      return books.filter(b => b.author.name === args.author && b.genres.includes(args.genre))
    },
    allAuthors: async () => {
      return await Author.find({})
    },
    me: async (root, args, context) => {
      return await User.findOne({ _id: context.currentUser })
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['BOOK_ADDED']) 
    }
  },

  Book: {
    author: async (root) => {
      const author = await Author.findOne({ _id: root.author._id })
      return {
        bookCount: author.bookCount,
        name: author.name,
        born: author.born,
        id: author.id,
      }
    },
  },

  Mutation: {
    addBook: async (root, args, contextValue) => {
      const currentUser = contextValue.currentUser

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNATHENTICATED",
          },
        })
      }

      const bookExists = await Book.exists({ title: args.title })
      if (bookExists) {
        throw new GraphQLError("book with the given title already exists", {
          extensions: "BAD_USER_INPUT",
          invalidArgs: args.title,
        })
      }

      const { title, published, genres } = args
      const newBook = new Book({ title, published, genres })
      const author = await Author.exists({ name: args.author })

      if (author) {
        newBook.author = author._id
        author.bookCount = author.bookCount + 1
        try {
          await newBook.save()
        } catch (error) {
          throw new GraphQLError(`title is too short, ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
            },
          })
        }
      } else {
        const newAuthor = new Author({ name: args.author })
        try {
          newAuthor.bookCount = 1
          await newAuthor.save()

          newBook.author = newAuthor._id
          await newBook.save()
        } catch (error) {
          throw new GraphQLError(
            `name or title is too short, ${error.message}`,
            {
              extensions: "BAD_USER_INPUT",
            },
          )
        }
      }
      
      pubsub.publish("BOOK_ADDED", { bookAdded: newBook })
      return newBook
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: "UNAUTHENTICATED",
        })
      }
      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      await author.save()
      return author
    },

    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError("username and favorite genre is required", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      return user
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== "secret") {
        throw new GraphQLError("username or password is incorrect", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const token = {
        value: jwt.sign(user.toObject(), process.env.JWT_SECRET),
      }
      return token
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode")
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})

      return true
    },
  },
}

module.exports = resolvers
