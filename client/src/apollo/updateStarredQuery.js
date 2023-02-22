import { gql } from '@apollo/client';

export const UPDATE_RECIPE_STAR = gql`
    mutation updateRecipeStarred($id: ID!, $isStarred: Boolean!) {
        updateRecipeStarred(id: $id, isStarred: $isStarred) @client
    }
`;
