const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const jwt = require("jsonwebtoken")

const typeDefs = require("./schema")
const resolvers = require("./resolvers")

const getCurrentUser = (token) => {
  if (!token || !token.startsWith("Bearer ")) {
    return null
  }
  const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET)

  return decoded._id
}

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => ({
      currentUser: getCurrentUser(req.headers.authorization),
    }),
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}

module.exports = startServer