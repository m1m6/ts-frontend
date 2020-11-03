import { useMutation } from '@apollo/react-hooks';
import { CUSTOMIZER_MUTATION, CUSTOMIZER_MUTATION_SERVER } from './gql';

export const useCustomizerMutationClient = () => useMutation(CUSTOMIZER_MUTATION);
export const useCustomizerMutation = () =>
    useMutation(CUSTOMIZER_MUTATION_SERVER, {
        refetchQueries: ['MeQuery'],
    });
