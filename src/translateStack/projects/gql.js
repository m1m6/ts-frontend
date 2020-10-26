import gql from 'graphql-tag';

export const userPagesQuery = gql`
    query userPages {
        userPages {
            id
            pageUrl
            updatedAt
            User {
                id
                fullName
            }
            strings {
                id
                original
                updatedAt
                translations {
                    translatedString
                    stringsId
                    id
                    languagesId
                }
            }
        }
    }
`;
