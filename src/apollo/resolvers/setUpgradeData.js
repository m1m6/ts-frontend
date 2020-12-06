import gql from 'graphql-tag';
import { apolloClient } from '../apolloClient';

export default (_, { shouldShowUpgradePopup, targetPlan }, { cache }) => {
    const query = gql`
        query getUpgradeData {
            upgrade @client {
                shouldShowUpgradePopup
                targetPlan
            }
        }
    `;
    const previousState = apolloClient.readQuery({ query });
    const data = {
        upgrade: {
            ...previousState.upgrade,
            shouldShowUpgradePopup,
            targetPlan,
        },
    };

    apolloClient.writeData({
        query,
        data,
    });

    return null;
};
