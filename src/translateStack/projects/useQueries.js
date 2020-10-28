import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { userPagesQuery } from './gql';

export const useUserPagesQuery = () =>
    useQuery(userPagesQuery, {
        fetchPolicy: 'network-only',
    });
