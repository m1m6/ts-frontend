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

export const INVITE_USER_GQL = gql`
    mutation inviteUser($email: String!, $role: UserRole!, $fullName: String!) {
        inviteUser(email: $email, role: $role, fullName: $fullName)
    }
`;

export const TEAM_MEMBERS_QUERY = gql`
    query teamMembers {
        teamMembers {
            id
            fullName
            role
            email
        }
    }
`;
