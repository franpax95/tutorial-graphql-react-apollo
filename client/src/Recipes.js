import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_RECIPES = gql`
    {
        recipes {
            id
            title
        }
    }
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
