import gql from 'graphql-tag';
import { apolloClient } from '../apolloClient';

export default (_, { shouldShowUpgradePopup }, { cache }) => {
    const query = gql`
        query getUpgradeData {
            upgrade @client {
                shouldShowUpgradePopup
            }
        }
    `;
    const previousState = apolloClient.readQuery({ query });
    const data = {
        upgrade: {
            ...previousState.upgrade,
            shouldShowUpgradePopup,
        },
    };

    apolloClient.writeData({
        query,
        data,
    });

    return null;
};
