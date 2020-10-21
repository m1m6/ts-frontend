import { changePasswordMutation } from './gql';
import { useMutation } from '@apollo/react-hooks';

export const useChangePasswordMutation = () => useMutation(changePasswordMutation);
