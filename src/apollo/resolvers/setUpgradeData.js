import gql from 'graphql-tag';
import { apolloClient } from '../apolloClient';

export default (
    _,
    {
        shouldShowUpgradePopup,
        targetPlan,
        shouldResetUpgradeData,
        selectedLanguagesIds,
        tempUserBranding,
        tempPageUrl,
    },
    { cache }
) => {
    const query = gql`
        query getUpgradeData {
            upgrade @client {
                shouldShowUpgradePopup
                targetPlan
                shouldResetUpgradeData
                selectedLanguagesIds
                tempUserBranding
                tempPageUrl
            }
        }
    `;
    const previousState = apolloClient.readQuery({ query });
    const data = {
        upgrade: {
            ...previousState.upgrade,
            shouldShowUpgradePopup,
            targetPlan,
            shouldResetUpgradeData,
            selectedLanguagesIds,
            tempUserBranding,
            tempPageUrl,
        },
    };

    apolloClient.writeData({
        query,
        data,
    });

    return null;
};
