import { useMutation } from '@apollo/react-hooks';
import {
    CUSTOMIZER_MUTATION,
    CUSTOMIZER_MUTATION_SERVER,
    UPDATE_TARGET_LANGUAGES_MUTATION,
} from './gql';

export const useCustomizerMutationClient = () =>
    useMutation(CUSTOMIZER_MUTATION, {
        refetchQueries: ['customizerQuery'],
    });
export const useCustomizerMutation = () =>
    useMutation(CUSTOMIZER_MUTATION_SERVER, {
        // refetchQueries: ['MeQuery'],
    });

export const useUpdateTargetLanguagesMutation = () =>
    useMutation(UPDATE_TARGET_LANGUAGES_MUTATION, {
        refetchQueries: ['userLanguages'],
    });
