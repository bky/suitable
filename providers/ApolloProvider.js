import React from 'react'
import {ApolloProvider, ApolloClient, ApolloLink, InMemoryCache, createHttpLink} from '@apollo/client'
import {onError} from '@apollo/client/link/error'

const httpLink = createHttpLink({uri: '/api/graphql', credentials: 'same-origin'})

const errorLink = onError(({graphQLErrors, networkError, operation, ...rest}) => {
  console.log(operation.operationName)
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      console.log(`[GraphQL error]: ${JSON.stringify(error)}`)
    })
  }
  if (networkError) {
    if (!networkError.response) {
      networkError.response = {status: 0}
    }
    networkError.message = `HTTP status: ${networkError.response.status}`
    console.log(networkError.message)
  }
})

const consoleLink = new ApolloLink((operation, forward) => {
  if (__DEV__) console.log(`Started operation ${operation.operationName} ${JSON.stringify(operation.variables)}`)
  return forward(operation).map((data) => {
    if (__DEV__) console.log(`Finished operation ${operation.operationName} ${JSON.stringify(operation.variables)}`)
    return data
  })
})

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, consoleLink, httpLink]),
  cache: new InMemoryCache({freezeResults: true}),
})

const _ApolloProvider = (props) => {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>
}

export default _ApolloProvider
