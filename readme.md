# GraphQL Data in React with Apollo Client
Source1: [https://egghead.io/courses/graphql-data-in-react-with-apollo-client](https://egghead.io/courses/graphql-data-in-react-with-apollo-client)
Source2: [https://www.apollographql.com/docs/react/get-started](https://www.apollographql.com/docs/react/get-started)

## Lesson 1: Setup and Connect an Apollo Client to a React Application with Apollo Provider

1. Install the following packages:
    ### `npm install --save graphql @apollo/client`

2. In index.js, let's first import the symbols we need from @apollo/client:
    `import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client'`

3. Next we'll initialize ApolloClient, passing its constructor a configuration object with the uri and cache fields:
    1. *uri* specifies the URL of our GraphQL server.
    2. *cache* is an instance of *InMemoryCache*, which Apollo Client uses to cache query results after fetching them.
    ```
        const client = new ApolloClient({
            uri: 'http://localhost:4000/',
            cache: new InMemoryCache(),
        });
    ```

4.  Our client is ready to start fetching data. In the same index.js file, call client.query() with the query string (wrapped in the gql template literal) shown below:
    ```
        // const client = ...

        client
            .query({
                query: gql`
                {
                    recipes {
                        id
                        title
                    }
                }
                `,
            })
            .then((result) => console.log(result));
    ```

5. You connect Apollo Client to React with the ApolloProvider component. Similar to React's Context.Provider, ApolloProvider wraps your React app and places Apollo Client on the context, enabling you to access it from anywhere in your component tree. In *index.js*, wrap your React app with an *ApolloProvider*.
    ```
        import React from 'react';
        import * as ReactDOM from 'react-dom/client';
        import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
        import App from './App';

        const client = new ApolloClient({
            uri: 'http://localhost:4000/',
            cache: new InMemoryCache(),
        });

        // Supported in React 18+
        const root = ReactDOM.createRoot(document.getElementById('root'));

        root.render(
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>,
        );
    ```

## Lesson 2: Fetch Data with *useQuery*

1. After your *ApolloProvider* is hooked up, you can start requesting data with *useQuery*. The *useQuery* hook is a React hook that shares GraphQL data with your UI. In the example, we create a component that use this feature:
    ```
        import React from 'react';
        import { useQuery, gql } from '@apollo/client';

        const GET_RECIPES = gql`
            {
                recipes {
                    id
                    title
                }
            };
        `

        export default function Recipes() {
            const { loading, error, data } = useQuery(GET_RECIPES);

            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error : {error.message}</p>;

            return (
                <ul>
                    {data.recipes.map(({ id, title }) => (<li key={id}>{title}</li>))}
                </ul>
            );
        }
    ```
    Whenever this component renders, the *useQuery* hook automatically executes our query and returns a result object containing *loading*, *error*, and *data* properties:
    1. Apollo Client automatically tracks a query's loading and error states, which are reflected in the *loading* and *error* properties.
    2. When the result of your query comes back, it's attached to the *data* property.

## Lesson 3: Provide Dynamic Arguments in a Apollo Query Component with GraphQL Variables

1. We can pass arguments to our queries. In order to filter for vegetarian recipes, our recipes query accepts a Boolean argument, vegetarian:
    ```
        const GET_RECIPES = gql`
            {
                recipes(vegetarian: true) {
                    id
                    title
                }
            }
        `;
    ```

2. We can ensure that a query must be provided with certain variables:
    ```
        const GET_RECIPES = gql`
            query recipes($vegetarian: Boolean!) {
                recipes(vegetarian: $vegetarian) {
                    id
                    title
                }
            }
        `;

        /** */

        const { loading, error, data } = useQuery(GET_RECIPES, {
            variables: { vegetarian: true }
        });
    ```

3. And we can make that variables depends on a React state. Combining all we have:
    #### Recipes.js
    ```
        // ...

        const GET_RECIPES = gql`
            query recipes($vegetarian: Boolean!) {
                recipes(vegetarian: $vegetarian) {
                    id
                    title
                }
            }
        `;

        export default function Recipes({ vegetarian = false }) {
            const { loading, error, data } = useQuery(GET_RECIPES, {
                variables: { vegetarian }
            });

            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error : {error.message}</p>;

            return (
                <ul>
                    {data.recipes.map(({ id, title }) => (<li key={id}>{title}</li>))}
                </ul>
            );
        }
    ```

    #### App.js
    ```
        // ...

        function App() {
            const [vegetarian, setVegetarian] = useState(false);

            return (
                <div>
                    <label>
                        Vegetarian?
                        <input type="checkbox" value={vegetarian} onChange={e => setVegetarian(e.target.checked)} />
                    </label>
                    <Recipes vegetarian={vegetarian} />
                </div>
            );
        }
    ```