import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_RECIPES } from './apollo/getRecipesQuery';
import { UPDATE_RECIPE_STAR } from './apollo/updateStarredQuery';

export default function Recipes({ vegetarian = false }) {
    const { loading, error, data } = useQuery(GET_RECIPES, {
        variables: { vegetarian }
    });

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

    if (loading)    return <p>Loading...</p>;
    if (error)      return <p>Error : {error.message}</p>;

    return (
        <ul className="Recipes">
            {data.recipes.map(({ id, title, isStarred }) => (
                <li key={id}>
                    <span>{title}</span>

                    <button onClick={e => onStarClick(e, { id, isStarred: !isStarred })} className={isStarred ? 'active' : ''}>
                        <span></span>
                    </button>
                </li>
            ))}
        </ul>
    );
}
