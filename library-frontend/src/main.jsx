import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"

import { ApolloClient,ApolloLink, HttpLink, InMemoryCache } from "@apollo/client"
import { ApolloProvider } from "@apollo/client/react"
import { SetContextLink } from "@apollo/client/link/context"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws"
import { OperationTypeNode } from "graphql"

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/"
  })
)


const httpLink = new HttpLink({ uri: "http://localhost:4000" })

const splitLink = ApolloLink.split(
  ({ operationType }) => {
    return operationType === OperationTypeNode.SUBSCRIPTION
  },
  wsLink,
  httpLink
)
const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
