import { ACCESS_TOKEN } from "../constants";

export const auth = {
	logIn: token => {
		auth.setAccessToken(token);
	},

	logOut: () => {
		auth.removeAccessToken();
	},

	// Access Token
	setAccessToken: token => localStorage.setItem(ACCESS_TOKEN, token),
	getAccessToken: () => localStorage.getItem(ACCESS_TOKEN),
	removeAccessToken: () => localStorage.removeItem(ACCESS_TOKEN)
};
