import gql from "graphql-tag";

export const signupMutation = gql`
	mutation signupMutation($fullName: String!, $email: String!, $password: String!, $role: UserRole!) {
		signup(fullName: $fullName, email: $email, password: $password, role: $role) {
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