import { useMutation } from '@apollo/react-hooks';
import { updateUserMetaDataGQL } from './gql';

export const useUpdateUserMetaDataMutation = () => useMutation(updateUserMetaDataGQL);
