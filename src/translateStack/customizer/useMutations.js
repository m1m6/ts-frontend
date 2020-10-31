import { useMutation } from '@apollo/react-hooks';
import { CUSTOMIZER_MUTATION } from './gql';

export const useCustomizerMutationClient = () => useMutation(CUSTOMIZER_MUTATION);
