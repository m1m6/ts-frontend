import gql from 'graphql-tag';
import { apolloClient } from '../apolloClient';

export default (
    _,
    { isOpen, position, text, shouldOpenTheSelectOptions, customDirection, languages, branding },
    { cache }
) => {
    const query = gql`
        query getCustomizerData {
            customizer @client {
                isOpen
                position
                text
                shouldOpenTheSelectOptions
                customDirection
                languages
                branding
            }
        }
    `;
    const previousState = apolloClient.readQuery({ query });
    const data = {
        customizer: {
            ...previousState.customizer,
            isOpen,
            position,
            text,
            shouldOpenTheSelectOptions,
            customDirection,
            languages,
            branding,
        },
    };

    apolloClient.writeData({
        query,
        data,
    });

    return null;
};
