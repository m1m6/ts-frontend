import { useQuery } from '@apollo/react-hooks';
import { CUSTOMIZER_QUERY } from './gql';

export const useCustomizerQueryClient = () => useQuery(CUSTOMIZER_QUERY);
