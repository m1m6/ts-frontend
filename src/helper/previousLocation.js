export const previousLocation = (routerLocation, defaultPath = "/me") =>
	routerLocation.state && (routerLocation.state.from || defaultPath);
