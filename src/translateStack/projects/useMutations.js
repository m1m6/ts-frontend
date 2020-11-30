import { useMutation } from '@apollo/react-hooks';
import { ADD_SINGLE_PAGE } from './gql';

export const useAddSinglePageMutation = () =>
    useMutation(ADD_SINGLE_PAGE, {
        refetchQueries: ['userPages', 'getUserPlan'],
        fetchPolicy: 'no-cache',
    });
