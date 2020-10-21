import React from 'react';
import { Link } from 'react-router-dom';
import { Result } from 'antd';

const PageNotFound = ({ location }) => (
	<div>
		<Result
			status="500"
			title="404"
			subTitle="Sorry, the page you visited does not exist."
			extra={<Link to="/">Back Home</Link>}
		/>
	</div>
);

export default PageNotFound;
