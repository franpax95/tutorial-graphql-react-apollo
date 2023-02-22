import { gql } from '@apollo/client';

export const GET_RECIPES = gql`
    query recipes($vegetarian: Boolean!) {
        recipes(vegetarian: $vegetarian) {
            id
            title
            isStarred @client
        }
    }
`;
