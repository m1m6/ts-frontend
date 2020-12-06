import gql from 'graphql-tag';

export const PLANS_LIST = gql`
    query plans {
        plans {
            id
            monthlyPriceId
            yearlyPriceId
            monthlyPriceAmount
            yearlyPriceAmount
            pages
            targetLanguages
            type
        }
    }
`;

export const subscription = gql`
    mutation subscription(
        $cardNumber: String!
        $expMonth: String!
        $expYear: String!
        $cvc: String!
        $planId: String!
        $cycle: String!
    ) {
        subscription(
            cardNumber: $cardNumber
            expMonth: $expMonth
            expYear: $expYear
            cvc: $cvc
            planId: $planId
            cycle: $cycle
        ) {
            status
        }
    }
`;

export const setUpgradeDataGQL = gql`
    mutation setUpgradeData($shouldShowUpgradePopup: Boolean!, $targetPlan: Int!) {
        setUpgradeData(shouldShowUpgradePopup: $shouldShowUpgradePopup, targetPlan: $targetPlan)
            @client {
            shouldShowUpgradePopup
            targetPlan
        }
    }
`;

export const UPGRADE_DATA_GQL = gql`
    query getUpgradeData {
        upgrade @client {
            shouldShowUpgradePopup
            targetPlan
        }
    }
`;
