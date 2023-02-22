import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import './index.css';
import App from './App';

export const STARRED_STORAGE = 'starredRecipes';

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
