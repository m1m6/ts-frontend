import { useMutation } from '@apollo/react-hooks';
import { PUBLISH_TRANSLATIONS_MUTATION } from './gql';

export const usePublishStringsMutation = () => useMutation(PUBLISH_TRANSLATIONS_MUTATION);
