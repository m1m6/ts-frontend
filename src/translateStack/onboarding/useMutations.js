import { useMutation } from '@apollo/react-hooks';
import { setOnboardingMutation } from './gql';

export const useOnboardingMutationClient = () => useMutation(setOnboardingMutation);
