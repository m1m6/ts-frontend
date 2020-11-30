import { useQuery } from '@apollo/react-hooks';
import { CUSTOMIZER_QUERY, CUSTOMIZER_QUERY_SERVER } from './gql';

export const useCustomizerQueryClient = () => useQuery(CUSTOMIZER_QUERY);
export const useCustomizerQueryServer = () => useQuery(CUSTOMIZER_QUERY_SERVER);

