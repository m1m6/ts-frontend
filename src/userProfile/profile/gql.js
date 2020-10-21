import gql from 'graphql-tag';

export const changePasswordMutation = gql`
    mutation changePassword($email: String!, $oldPassword: String!, $newPassword: String!) {
        changePassword(email: $email, oldPassword: $oldPassword, newPassword: $newPassword) {
            user {
                id
                name
                email
            }
            token
        }
    }
`;
