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
