import gql from 'graphql-tag';

export const ME_QUERY = gql`
    query MeQuery {
        me {
            id
            email
            fullName
            role
            isNew
            skippedOnboarding
            customizer {
                id
                position
                text
                appearance
                publishedLanguages
                customDivId
            }
            languages {
                Languages {
                    id
                    abbreviation
                    language
                    flag
                }
            }
            pages {
                id
            }
        }
    }
`;

export const ME_QUERY_CLIENT = gql`
    query MeQuery {
        me @client {
            id
            email
            fullName
            role
            isNew
        }
    }
`;

export const LANGUAGES_LIST_QUERY = gql`
    query MeQuery {
        languagesList @client {
            id
            abbreviation
            language
            flag
            iso2
        }
    }
`;
