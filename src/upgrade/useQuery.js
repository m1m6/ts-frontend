import { useQuery } from '@apollo/react-hooks';
import { PLANS_LIST, UPGRADE_DATA_GQL } from './gql';

export const usePlansListQuery = () => useQuery(PLANS_LIST);
export const useUpgradeDataQueryClient = () => useQuery(UPGRADE_DATA_GQL);
