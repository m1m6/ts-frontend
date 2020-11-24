import { useMutation } from '@apollo/react-hooks';
import {
    DELETE_PAGE,
    DELETE_PAGE_TRANSLATIONS,
    PUBLISH_TRANSLATIONS_MUTATION,
    REFETCH_PAGE,
} from './gql';

export const usePublishStringsMutation = () => useMutation(PUBLISH_TRANSLATIONS_MUTATION);
export const useRefetchPage = () => useMutation(REFETCH_PAGE);
export const useDeletePage = () => useMutation(DELETE_PAGE);
export const useDeletePageTranslations = () => useMutation(DELETE_PAGE_TRANSLATIONS);
