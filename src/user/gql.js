import gql from 'graphql-tag';

export const ONBOARDING_QUERY_CLIENT = gql`
    query OnboardingQuery {
        onboarding @client {
            currentStep
        }
    }
`;

export const ONBOARDING_MUTATION = gql`
    mutation onboarding($pageUrl: String!, $translationLanguages: [Int!]!, $sourceLanguage: Int!) {
        onboarding(
            pageUrl: $pageUrl
            translationLanguages: $translationLanguages
            sourceLanguage: $sourceLanguage
        )
    }
`;

export const UPDATE_USER_MUTATION = gql`
    mutation updateUser($isNew: Boolean, $skippedOnboarding: Boolean, $sourceLanguage: Int) {
        updateUser(
            isNew: $isNew
            skippedOnboarding: $skippedOnboarding
            sourceLanguage: $sourceLanguage
        )
    }
`;

export const USER_LANGUAGES_QUERY = gql`
    query userLanguages {
        userLanguages {
            isActive
            Language {
                id
                localName
                flag
                language
                iso2
                abbreviation
            }
        }
    }
`;

export const USER_SUBSCRIPTION_PLAN = gql`
    query getUserPlan {
        getUserPlan {
            stripeCustomerId
            subscription
            planId
            status
            isInTrialPeriod
            trialEnds
            subscriptionCycle
            plan {
                id
                type
                monthlyPriceId
                yearlyPriceId
                targetLanguages
                pages
                monthlyPriceAmount
                yearlyPriceAmount
            }
        }
    }
`;

export const CUSTOMER_CARDS = gql`
    query getCustomerCard {
        getCustomerCard
    }
`;
