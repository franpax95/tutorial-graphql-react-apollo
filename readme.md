# GraphQL Data in React with Apollo Client
Source: [https://egghead.io/courses/graphql-data-in-react-with-apollo-client](https://egghead.io/courses/graphql-data-in-react-with-apollo-client)
## Lesson 1

Setup and Connect an Apollo Client to a React Application with Apollo Provider

1. Install the following packages:
    ### `npm install --save graphql apollo-boost react-apollo`

    **Warning**
    If you're using React version 18.0.0 or greater, it's possible that 'react-apollo' installation fails because it works with React version 16.8.0. In that case, use the following command for its installation: `npm install --save --legacy-peer-deps react-apollo`

2. Import ApolloClient from apollo-boost and instantiate a new client. The only mandatory option we need to provide is the URI for our GrphQL endpoint.
    `import ApolloClient from 'apollo-boost'`
    `const client = new ApolloClient({ uri: 'http://localhost:4000/' })`

3. You can verify if our client works as expected by requesting data from our GraphQl endpoint using a query.
    ``client.query({ query: gql`
        {
            recipes {
                id
                title
            }
        }
    `});``

4. We can use Apollo provider to pass the client down the rendering tree via React's context feature. This provider required an instantiated Apollo client.
    ```
        import { ApolloProvider, ApolloConsumer } from 'react-apollo'

        <ApolloProvider client={client}>
            <div>Hello World!</div>

            <ApolloConsumer>
                {client => {
                    client.query({ query: gql`
                        {
                            recipes {
                                id
                                title
                            }
                        }
                    ` }).then(result => console.dir(result));
                    
                    return null;
                }}
            </ApolloConsumer>
        </ApolloProvider>
    ```

