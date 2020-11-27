import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { browserHistory } from '../browserHistory';
import { auth } from '../signupLogin/auth';

const hasAccess = (roles, userRole) => {
    return roles.includes(userRole);
};

const ProtectedRoute = ({ component: Component, userRole, isNew, roles, ...rest }) => {
    const token = auth.getAccessToken();
    const [isAuth, setIsAuth] = useState(false);
    let isAuthorizedToAccess;
    let isSkippedOnboarding = false;

    // useEffect(() => {
    //     setIsAuth(hasAccess(roles, userRole));
    // }, [roles, userRole]);
    useLayoutEffect(() => {
        const token = auth.getAccessToken();
        if (token && !hasAccess(roles, userRole)) {
            browserHistory.push('/');
        }
    }, []);

    console.log('isAuth', isAuth);
    return token ? (
        <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />
    ) : (
        <Redirect to="/login" />
    );
};

export default ProtectedRoute;
