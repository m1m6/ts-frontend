import { useQuery } from '@apollo/react-hooks';
import { LANGUAGES_LIST_QUERY, ME_QUERY, ME_QUERY_CLIENT } from './rootGql';

export const useMeQuery = () => useQuery(ME_QUERY, {
    fetchPolicy: "network-only"
});
export const useMeQueryClient = () => useQuery(ME_QUERY_CLIENT);
export const useLanugagesListQuery = () => useQuery(LANGUAGES_LIST_QUERY);
