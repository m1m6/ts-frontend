import { useQuery } from '@apollo/react-hooks';
import { USER_LANGUAGES_QUERY, USER_SUBSCRIPTION_PLAN } from './gql';

export const useUserLanguagesQuery = () => useQuery(USER_LANGUAGES_QUERY);
export const useUserSubscriptionPlan = () => useQuery(USER_SUBSCRIPTION_PLAN);
