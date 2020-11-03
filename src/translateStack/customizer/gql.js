import gql from 'graphql-tag';

export const CUSTOMIZER_QUERY = gql`
    query customizerQuery {
        customizer @client {
            isOpen
            position
            text
            shouldOpenTheSelectOptions
        }
    }
`;

export const CUSTOMIZER_MUTATION = gql`
    mutation setCustomizerData(
        $isOpen: Boolean
        $position: String
        $text: String
        $shouldOpenTheSelectOptions: Boolean
    ) {
        setCustomizerData(
            isOpen: $isOpen
            position: $position
            text: $text
            shouldOpenTheSelectOptions: $shouldOpenTheSelectOptions
        ) @client {
            isOpen
            position
            text
            shouldOpenTheSelectOptions
        }
    }
`;

export const CUSTOMIZER_MUTATION_SERVER = gql`
    mutation updateCustomizer(
        $position: String
        $text: String
        $publishedLanguages: [Int!]
        $appearance: String,
        $customDivId: String
    ) {
        updateCustomizer(
            position: $position
            text: $text
            publishedLanguages: $publishedLanguages
            appearance: $appearance,
            customDivId: $customDivId
        ) {
            position
            text
            publishedLanguages
            appearance
            customDivId
        }
    }
`;
