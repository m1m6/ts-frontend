import { useMutation } from '@apollo/react-hooks';
import { RESET_PASSWORD_GQL, signupMutation } from './gql';

export const useSignup = () => useMutation(signupMutation);
export const useResetPassword = () => useMutation(RESET_PASSWORD_GQL);
