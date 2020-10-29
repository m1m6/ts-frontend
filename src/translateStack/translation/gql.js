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
                    languagesId
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
