import gql from "graphql-tag";

export const LOGIN_USER_MUTATION = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				role
				email
				fullName
				isNew
			}
		}
	}
`;

export const setUserDataMutation = gql`
	mutation setUserData($fullName: String!, $id: ID!, $email: String!, $role: UserRole!, $isNew: Boolean!) {
		setUserData(fullName: $fullName, id: $id, email: $email, role: $role, isNew: $isNew) @client {
			fullName
			id
			email
			role
			isNew
		}
	}
`;
