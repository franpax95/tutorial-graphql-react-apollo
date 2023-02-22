import { gql } from '@apollo/client';

export const ADD_RECIPE = gql`
    mutation addRecipe($recipe: RecipeInput!) {
        addRecipe(recipe: $recipe) {
            id
            title
        }
    }
`;
