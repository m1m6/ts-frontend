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
        }
    }
`;

export const CUSTOMIZER_MUTATION = gql`
    mutation setCustomizerData(
        $isOpen: Boolean
        $position: String
        $text: String
        $shouldOpenTheSelectOptions: Boolean
        $customDirection: String,
        $languages: [Int],
        $branding: String
    ) {
        setCustomizerData(
            isOpen: $isOpen
            position: $position
            text: $text
            shouldOpenTheSelectOptions: $shouldOpenTheSelectOptions
            customDirection: $customDirection
            languages: $languages
            branding: $branding
        ) @client {
            isOpen
            position
            text
            shouldOpenTheSelectOptions
            customDirection
            languages
            branding
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
