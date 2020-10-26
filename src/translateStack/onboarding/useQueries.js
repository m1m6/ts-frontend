import { useQuery } from '@apollo/react-hooks';
import { ONBOARDING_QUERY_CLIENT } from '../../user/gql';

export const useOnboardingQueryClient = () => useQuery(ONBOARDING_QUERY_CLIENT);
