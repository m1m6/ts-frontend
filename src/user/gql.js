import gql from 'graphql-tag';

export const ONBOARDING_QUERY_CLIENT = gql`
    query OnboardingQuery {
        onboarding @client {
            currentStep
        }
    }
`;

export const ONBOARDING_MUTATION = gql`
    mutation onboarding($pageUrl: String!, $translationLanguages: [Int!]!, sourceLanguage: Int!) {
        onboarding(pageUrl: $pageUrl, translationLanguages: $translationLanguages, sourceLanguage: $sourceLanguage)
    }
`;

export const UPDATE_USER_MUTATION = gql`
    mutation updateUser($isNew: Boolean, $skippedOnboarding: Boolean) {
        updateUser(isNew: $isNew, skippedOnboarding: $skippedOnboarding)
    }
`;
