import gql from 'graphql-tag';

export const getPageQuery = gql`
    query getPage($pageId: Int!) {
        getPage(pageId: $pageId) {
            id
            pageUrl
            updatedAt
            strings {
                id
                original
                updatedAt
                translations {
                    id
                    translatedString
                    updatedAt
                }
            }
        }
    }
`;
