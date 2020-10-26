import React from 'react';
import { Link as RLink } from 'react-router-dom';
import classnames from 'classnames';

const Link = ({ label, to, blackLink, style, onClick }) => {
	return (
		<RLink
			to={to}
			onClick={onClick}
			className={classnames('btn-link', { black: blackLink })}
			style={style}
		>
			{label}
		</RLink>
	);
};

export default Link;
