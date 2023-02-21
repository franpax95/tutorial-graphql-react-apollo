import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECIPES } from './getRecipesQuery';


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
