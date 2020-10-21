import gql from 'graphql-tag';
import { apolloClient } from '../apolloClient';

export default (_, { fullName, id, email, role, isNew }, { cache }) => {
    const query = gql`
        query getUserData {
            userData @client {
                fullName
                email
                id
                role
                isNew
            }
        }
    `;
    const previousState = apolloClient.readQuery({ query });
    const data = {
        userData: {
            ...previousState.userData,
            fullName,
            id,
            email,
            role,
            isNew,
        },
    };
    console.log('data', data);

    apolloClient.writeData({
        query,
        data,
    });

    return null;
};
