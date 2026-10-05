require("dotenv").config()

const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")

const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const typeDefs = require("./schema")
const resolvers = require("./resolvers")

const server = new ApolloServer({
  typeDefs,
  resolvers,
})
const PORT = process.env.PORT
const dbUri = process.env.MONGODB_URI

mongoose.connect(dbUri).then(() => {
  console.log("Mongodb connected at ", dbUri)
})

const getCurrentUser = (token) => {
  if (!token.startsWith("Bearer ")) {
    return null
  }
  const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET)

  return decoded._id
}

startStandaloneServer(server, {
  listen: { port: PORT || 4000 },
  context: async ({ req }) => ({
    currentUser: getCurrentUser(req.headers.authorization),
  }),
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
