import React from 'react';
import { Link as RLink } from 'react-router-dom';
import classnames from 'classnames';

const Link = ({ label, to, blackLink, target, style, onClick }) => {
	return (
		<RLink
			to={to}
			onClick={onClick}
			className={classnames('btn-link', { black: blackLink })}
			target={target}
			style={style}
		>
			{label}
		</RLink>
	);
};

export default Link;
