import { useMutation } from '@apollo/react-hooks';
import { INVITE_USER_GQL, updateUserMetaDataGQL } from './gql';

export const useUpdateUserMetaDataMutation = () => useMutation(updateUserMetaDataGQL);
export const useInviteUserMutation = () => useMutation(INVITE_USER_GQL);
