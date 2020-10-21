import React from "react";

const Button = ({ children, ...rest }) => (
	<button size="large" {...rest}>
		{children}
	</button>
);

export default Button;
