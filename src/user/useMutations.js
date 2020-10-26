import { useMutation } from '@apollo/react-hooks';
import { ONBOARDING_MUTATION, UPDATE_USER_MUTATION } from './gql';

export const useOnboardingMutation = () => useMutation(ONBOARDING_MUTATION);
export const useUpdateUserMutation = () => useMutation(UPDATE_USER_MUTATION);
