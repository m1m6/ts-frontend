import { useMutation } from '@apollo/react-hooks';
import { DELETE_PAGE, PUBLISH_TRANSLATIONS_MUTATION, REFETCH_PAGE } from './gql';

export const usePublishStringsMutation = () => useMutation(PUBLISH_TRANSLATIONS_MUTATION);
export const useRefetchPage = () => useMutation(REFETCH_PAGE);
export const useDeletePage = () => useMutation(DELETE_PAGE);
