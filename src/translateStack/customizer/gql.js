import gql from 'graphql-tag';

export const CUSTOMIZER_QUERY = gql`
    query customizerQuery {
        customizer @client {
            isOpen
            position
            text
        }
    }
`;

export const CUSTOMIZER_MUTATION = gql`
    mutation setCustomizerData($isOpen: Boolean, $position: String, $text: String) {
        setCustomizerData(isOpen: $isOpen, position: $position, text: $text) @client {
            isOpen
            position
            text
        }
    }
`;
