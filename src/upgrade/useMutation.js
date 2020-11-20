import { useMutation } from '@apollo/react-hooks';
import { subscription } from './gql';

export const useSubscriptionMutation = () =>
    useMutation(subscription, {
        refetchQueries: ['getUserPlan'],
        awaitRefetchQueries: true
    });
