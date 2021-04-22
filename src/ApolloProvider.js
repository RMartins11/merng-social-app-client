import React from "react"
import App from "./App"
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider, ApolloLink} from "@apollo/client"

const httpLink = createHttpLink({
  uri: "http://localhost:5000"
})

const authLink = new ApolloLink((operation, forward)=>{
  const token = localStorage.getItem('jwtToken');
  operation.setContext(({headers})=>({
      headers: {
          Authorization: token ? `Bearer ${token}`: ''
      }
  }))
  return forward(operation)
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
      typePolicies: {
          Query: {
              fields: {
                  getPosts: {
                      merge(existing, incoming) {
                          return incoming;
                      },
                  },
              },
          },
      },
  }),
});



export default (
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
)
