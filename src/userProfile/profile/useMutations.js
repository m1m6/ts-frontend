import { useMutation } from '@apollo/react-hooks';
import { ADD_CREDIT_CARD_GQL, INVITE_USER_GQL, updateUserMetaDataGQL } from './gql';

export const useUpdateUserMetaDataMutation = () => useMutation(updateUserMetaDataGQL);
export const useInviteUserMutation = () =>
    useMutation(INVITE_USER_GQL, {
        refetchQueries: ['teamMembers'],
    });

export const useAddCreditCardMutation = () =>
    useMutation(ADD_CREDIT_CARD_GQL, {
        refetchQueries: ['getCustomerCard'],
    });
