import React from 'react';
import { auth } from '../signupLogin/auth';
import { Icon } from 'antd';

const PageLayout = ({ history, Component, title, isNew, ...rest }) => {
	console.log(isNew)
    if (isNew) {
        return (
            <div className="onboarding-page-layout">
                <Component routerHistory={history} {...rest} />
            </div>
        );
    } else
        return (
            <div className="page-layout">
                {/* <span><Icon type="left-circle" onClick={()=> history.goBack()}/></span> */}
                <h1 className="page-title">{title}</h1>
                <Component routerHistory={history} {...rest} />
            </div>
        );
};

export default PageLayout;
