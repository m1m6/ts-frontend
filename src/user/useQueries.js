import { useQuery } from '@apollo/react-hooks';
import { USER_LANGUAGES_QUERY } from './gql';

export const useUserLanguagesQuery = () => useQuery(USER_LANGUAGES_QUERY);
