import gql from 'graphql-tag';

export const CUSTOMIZER_QUERY = gql`
    query customizerQuery {
        customizer @client {
            isOpen
            position
            text
            shouldOpenTheSelectOptions
            customDirection
            languages
            branding
            removedItems
            openLanguagesComponent
        }
    }
`;

export const CUSTOMIZER_QUERY_SERVER = gql`
    query getUserCustomizer {
        getUserCustomizer {
            id
            customDivId
            position
            text
            appearance
            customDivDirection
        }
    }
`;

export const CUSTOMIZER_MUTATION = gql`
    mutation setCustomizerData(
        $isOpen: Boolean
        $position: String
        $text: String
        $shouldOpenTheSelectOptions: Boolean
        $customDirection: String
        $languages: [Int]
        $branding: String
        $removedItems: [Int]
        $openLanguagesComponent: Boolean
    ) {
        setCustomizerData(
            isOpen: $isOpen
            position: $position
            text: $text
            shouldOpenTheSelectOptions: $shouldOpenTheSelectOptions
            customDirection: $customDirection
            languages: $languages
            branding: $branding
            removedItems: $removedItems
            openLanguagesComponent: $openLanguagesComponent
        ) @client {
            isOpen
            position
            text
            shouldOpenTheSelectOptions
            customDirection
            languages
            branding
            removedItems
            openLanguagesComponent
        }
    }
`;

export const CUSTOMIZER_MUTATION_SERVER = gql`
    mutation updateCustomizer(
        $position: String
        $text: String
        $publishedLanguages: [Int!]
        $appearance: String
        $customDivId: String
        $customDivDirection: String
    ) {
        updateCustomizer(
            position: $position
            text: $text
            publishedLanguages: $publishedLanguages
            appearance: $appearance
            customDivId: $customDivId
            customDivDirection: $customDivDirection
        ) {
            position
            text
            publishedLanguages
            appearance
            customDivId
            customDivDirection
        }
    }
`;

export const UPDATE_TARGET_LANGUAGES_MUTATION = gql`
    mutation updateTargetLanguages($selectedLanguagesIds: [Int!]!) {
        updateTargetLanguages(selectedLanguagesIds: $selectedLanguagesIds)
    }
`;
