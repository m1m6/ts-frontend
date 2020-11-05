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
            pageString {
                id
                original
                updatedAt
                translations {
                    translatedString
                    pageStringId
                    id
                    languageId
                }
            }
        }
    }
`;

export const ADD_SINGLE_PAGE = gql`
    mutation addSinglePage($pageUrl: String!) {
        addSinglePage(pageUrl: $pageUrl)
    }
`;
