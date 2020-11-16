import gql from 'graphql-tag';

export const updateUserMetaDataGQL = gql`
    mutation updateUserMetaData($email: String!, $password: String, $fullName: String!) {
        updateUserMetaData(email: $email, password: $password, fullName: $fullName) {
            user {
                id
                fullName
                email
            }
            token
        }
    }
`;
