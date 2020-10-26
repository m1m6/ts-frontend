import gql from 'graphql-tag';

export const setOnboardingMutation = gql`
    mutation setOnboardingData($currentStep: Number!) {
        setOnboardingData(currentStep: $currentStep) @client {
            currentStep
        }
    }
`;
