import gql from 'graphql-tag';
import { apolloClient } from '../apolloClient';

export default (_, { currentStep }, { cache }) => {
    const query = gql`
        query getOnboardingData {
            onboarding @client {
                currentStep
            }
        }
    `;
    const previousState = apolloClient.readQuery({ query });
    const data = {
        onboarding: {
            ...previousState.onboarding,
            currentStep,
        },
    };

    apolloClient.writeData({
        query,
        data,
    });

    return null;
};
