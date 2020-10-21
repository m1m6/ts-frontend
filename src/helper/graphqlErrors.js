import { message } from "antd";

export const showAllGraphQLErrors = errors => {
	for (const error of errors) {
		message.error(error.message);
	}
};
