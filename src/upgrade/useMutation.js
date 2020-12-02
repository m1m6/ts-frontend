import { useMutation } from '@apollo/react-hooks';
import { subscription, setUpgradeDataGQL } from './gql';

export const useSubscriptionMutation = () =>
    useMutation(subscription, {
        refetchQueries: ['getUserPlan'],
        awaitRefetchQueries: true,
    });

export const useSetUpgradeDataClient = () => useMutation(setUpgradeDataGQL);
