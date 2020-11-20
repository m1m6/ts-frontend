import { useQuery } from '@apollo/react-hooks';
import { PLANS_LIST } from './gql';

export const usePlansListQuery = () => useQuery(PLANS_LIST);
