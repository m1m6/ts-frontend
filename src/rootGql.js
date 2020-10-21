import gql from 'graphql-tag';

export const ME_QUERY = gql`
	query MeQuery {
		me {
			id
			email
			fullName
			role
			isNew
		}
	}
`;

export const ME_QUERY_CLIENT = gql`
	query MeQuery {
		me @client {
			id
			email
			fullName
			role
			isNew
		}
	}
`;

