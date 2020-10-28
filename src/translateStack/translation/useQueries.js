import { useQuery } from '@apollo/react-hooks';
import { getPageQuery } from './gql';

export const useGetPageQuery = (pageId) =>
    useQuery(getPageQuery, {
        variables: {
            pageId,
        },
    });
