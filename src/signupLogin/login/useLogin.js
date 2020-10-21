import { useMutation } from '@apollo/react-hooks'
import { LOGIN_USER_MUTATION } from './gql'

export const useLogin = () => useMutation(LOGIN_USER_MUTATION)