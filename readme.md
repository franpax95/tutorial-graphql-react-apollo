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

# Lesson 4: Mutations in Apollo Client
### Modify data with the useMutation hook

1. To execute a mutation, you first call *useMutation* within a React component and pass it the mutation you want to execute, like so:
    ```
        import React, { useState } from 'react';
        import { useMutation, gql } from '@apollo/client';

        const ADD_RECIPE = gql`
            mutation addRecipe($recipe: RecipeInput!) {
                addRecipe(recipe: $recipe) {
                    id
                    title
                }
            }
        `;

        export default function AddRecipe() {
            const [addRecipe, { data, loading, error }] = useMutation(ADD_RECIPE);

            const [title, setTitle] = useState('');
            const [vegetarian, setVegetarian] = useState(false);

            const onSubmit = event => {
                event.preventDefault();
                addRecipe({ variables: { recipe: { title, vegetarian }}});
            }

            if (loading)    return 'Submitting...';
            if (error)      return `Submission error! ${error.message}`;

            return (
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>
                            Vegetarian
                            <input type="checkbox" value={vegetarian} onChange={e => setVegetarian(e.target.checked)} />
                        </label>
                    </div>

                    <input type="submit" value="Save" />
                </form>
            );
        }
    ```
    We passed an argument to our mutation query to add a Recipe. In this example, we use the function *addRecipe* to get the recipe to insert. We can pass it in the hooks directly.
    ```
        const [addRecipe, { data, loading, error }] = useMutation(ADD_RECIPE, {
            variables: { recipe: {
                title: 'Placeholder',
                vegetarian: false
            }}
        });
    ```
    If you provide the same option to both *useMutation* and your mutate function, the mutate function's value takes precedence. This is useful to declare some default values to our Recipes, for example.
    
    Now, we already send a recipe to our GraphQL Server. However, our recipe list is located in another component, so if we already have data loaded, we cannot see it.

2. If you know that your app usually needs to refetch certain queries after a particular mutation, you can include a *refetchQueries* array in that mutation's options. In this case we have a query that depends on the Boolean variable 'vegetable', so we add two queries, in order to ensure that we refresh all possibilities:
    ```
        import { GET_RECIPES } from './getRecipesQuery';

        export default function AddRecipe() {
            const [addRecipe, { data, loading, error }] = useMutation(ADD_RECIPE, {
                refetchQueries: [
                    { 
                        query: GET_RECIPES,
                        variables: { vegetarian: true }
                    },
                    { 
                        query: GET_RECIPES,
                        variables: { vegetarian: false }
                    },
                ]
            });

            // ...
        }
    ```

3. We can extend the loading state until the refreshQueries finish if we specify the *awaitRefetchQueries*, like so:
    ```
        const [addRecipe, { data, loading, error }] = useMutation(ADD_RECIPE, {
            refetchQueries: [/** Your queries */],
            awaitRefetchQueries: true
        });
    ```

# Lesson 5: Manage Local State using Apollo by extending the GraphQL Schema on the Client
Apollo introduced a way to manage local state through GraphQL queries and mutations. This can be achieved using the @client directive.

1. Your Apollo Client queries can include local-only fields that aren't defined in your GraphQL server's schema:
    ```
        export const GET_RECIPES = gql`
            query recipes($vegetarian: Boolean!) {
                recipes(vegetarian: $vegetarian) {
                    id
                    title
                    isStarred @client @ This is a local-only field
                }
            }
        `;
    ```
    The values for these fields are calculated locally using any logic you want, such as reading data from *localStorage*.

2. To query your 'local' field, we can use resolvers. We add these on the client initialization:
    ```
        const client = new ApolloClient({
            uri: 'http://localhost:4000/',
            cache: new InMemoryCache(),
            resolvers: {
                Recipe: {
                    isStarred: parent => {
                        const starredRecipes = JSON.parse(localStorage.getItem(STARRED_STORAGE)) || [];
                        return starredRecipes.includes(parent.id);
                    }
                },
                Mutation: {
                    updateRecipeStarred: (_, variables) => {
                        const starredRecipes = JSON.parse(localStorage.getItem(STARRED_STORAGE)) || [];
                        if (variables.isStarred) {
                            localStorage.setItem(STARRED_STORAGE, JSON.stringify([...starredRecipes, variables.id]));
                        } else {
                            localStorage.setItem(STARRED_STORAGE, JSON.stringify(starredRecipes.filter(recipeId => recipeId !== variables.id)));
                        }

                        return ({
                            __typename: 'Recipe',
                            isStarred: variables.isStarred,
                        });
                    }
                }
            }
        });
    ```
    The Recipe resolver manages the reading of which recipes have a star. It search if the recipe id is included in the local storage collection. The *Mutation* resolver manages the updating of the local storage through a mutation. This mutation does not exist yet.

3. We need a mutation that allow us to update the isStarred field of a recipe.
    ```
        export const UPDATE_RECIPE_STAR = gql`
            mutation updateRecipeStarred($id: ID!, $isStarred: Boolean!) {
                updateRecipeStarred(id: $id, isStarred: $isStarred) @client
            }
        `;
    ```
    Then, you just have to use it, passing the new isStarred value for a specific id:
    ```
        const [updateRecipeStarred] = useMutation(UPDATE_RECIPE_STAR, {
            refetchQueries: [
                { 
                    query: GET_RECIPES,
                    variables: { vegetarian: true }
                },
                { 
                    query: GET_RECIPES,
                    variables: { vegetarian: false }
                },
            ],
            awaitRefetchQueries: true
        });

        const onStarClick = (event, recipe) => {
            updateRecipeStarred({ variables: { ...recipe }});
        }
    ```
    Note that we still use our refetchQueries: we want to refresh our data, to see the changes on the other component which is calling the read query.

# Lesson 6: Refetch Data either Manually or on Timed Intervals

1. We can export the *refetch* function directly from our *useQuery* hook, like so:
    ```
        const { loading, error, data, refetch } = useQuery(GET_RECIPES);
    ```
    If we call it, we can refresh the data. *You can check it adding data in another tab browser, then refresh your data.*

2. We can specify a poll interval to refresh our data automatically:
    ```
        const { loading, error, data, refetch } = useQuery(GET_RECIPES, {
            pollInterval: 3000
        });
    ```
    