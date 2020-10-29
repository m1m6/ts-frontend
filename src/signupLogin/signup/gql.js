import gql from "graphql-tag";

export const signupMutation = gql`
	mutation signupMutation($fullName: String!, $email: String!, $password: String!) {
		signup(fullName: $fullName, email: $email, password: $password) {
			token
			user {
				id
				fullName
				role
				email
				isNew
			}
		}
	}
`;