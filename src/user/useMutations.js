import { useMutation } from '@apollo/react-hooks';
import { ME_QUERY } from '../rootGql';
import { ONBOARDING_MUTATION, UPDATE_USER_MUTATION } from './gql';

export const useOnboardingMutation = () => useMutation(ONBOARDING_MUTATION);
export const useUpdateUserMutation = () => useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: ['MeQuery']
});
