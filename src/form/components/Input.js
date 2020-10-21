import React from "react";

const Input = ({ children, ...rest }) => (
	<input className="ts-input" size="large" type="text" {...rest} >
		{children}
	</input>
);

export default Input;
