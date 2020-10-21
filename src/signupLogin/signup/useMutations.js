import { useMutation } from "@apollo/react-hooks";
import { signupMutation } from "./gql";

export const useSignup = () => useMutation(signupMutation);
