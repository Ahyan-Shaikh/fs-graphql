const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const jwt = require("jsonwebtoken")

const express = require("express")
const cors = require("cors")
const http = require("http")
const { makeExecutableSchema } = require("@graphql-tools/schema")
const { WebSocketServer } = require("ws")
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer")
const { useServer } = require("graphql-ws/use/ws")

const typeDefs = require("./schema")
const resolvers = require("./resolvers")
const { expressMiddleware } = require("@as-integrations/express5")

const getCurrentUser = (token) => {
  if (!token || !token.startsWith("Bearer ")) {
    return null
  }
  const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET)
  return decoded._id
}
const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          currentUser: getCurrentUser(req.headers.authorization)
        }
      }
    })
  )
  httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}

module.exports = startServer