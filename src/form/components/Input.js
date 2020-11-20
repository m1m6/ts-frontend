import React from "react";

const Input = ({ children, ref , ...rest }) => (
	<input className="ts-input" size="large" type="text" ref={ref} {...rest} >
		{children}
	</input>
);

export default Input;
