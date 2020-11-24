import gql from 'graphql-tag';

export const getPageQuery = gql`
    query getPage($pageId: Int!) {
        getPage(pageId: $pageId) {
            id
            pageUrl
            updatedAt
            pageString {
                id
                original
                updatedAt
                translations {
                    id
                    languageId
                    translatedString
                    updatedAt
                }
            }
        }
    }
`;

export const PUBLISH_TRANSLATIONS_MUTATION = gql`
    mutation addTranslations($input: [TranslationInput!]!) {
        addTranslations(input: $input)
    }
`;

export const REFETCH_PAGE = gql`
    mutation refetchPage($pageId: Int!) {
        refetchPage(pageId: $pageId) {
            id
        }
    }
`;

export const DELETE_PAGE = gql`
    mutation deletePage($pageId: Int!) {
        deletePage(pageId: $pageId)
    }
`;

export const DELETE_PAGE_TRANSLATIONS = gql`
    mutation deletePageTranslations($pageId: Int!) {
        deletePageTranslations(pageId: $pageId) {
            id
        }
    }
`;
