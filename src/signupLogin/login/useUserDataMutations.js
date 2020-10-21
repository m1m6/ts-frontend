import { useMutation } from '@apollo/react-hooks'
import { setUserDataMutation } from './gql'

export const useUserData = () => useMutation(setUserDataMutation)