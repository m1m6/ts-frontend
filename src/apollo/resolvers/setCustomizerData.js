import gql from 'graphql-tag';
import { apolloClient } from '../apolloClient';

export default (_, { isOpen, position, text}, { cache }) => {
    const query = gql`
        query getCustomizerData {
            customizer @client {
                isOpen
                position
                text
            }
        }
    `;
    const previousState = apolloClient.readQuery({ query });
    const data = {
        customizer: {
            ...previousState.customizer,
            isOpen,
            position,
            text
        },
    };
    console.log('isOpen', data);

    apolloClient.writeData({
        query,
        data,
    });

    return null;
};
