import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { GET_RECIPES } from './getRecipesQuery';

const ADD_RECIPE = gql`
    mutation addRecipe($recipe: RecipeInput!) {
        addRecipe(recipe: $recipe) {
            id
            title
        }
    }
`;

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
        ],
        awaitRefetchQueries: true
    });

    const [title, setTitle] = useState('');
    const [vegetarian, setVegetarian] = useState(false);

    const onSubmit = event => {
        event.preventDefault();
        addRecipe({ variables: { recipe: { title, vegetarian }}}).then(res => {
            console.dir(res);
        });
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
