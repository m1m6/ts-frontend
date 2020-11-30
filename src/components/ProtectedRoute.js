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

    useEffect(() => {
        const token = auth.getAccessToken();
        // setIsAuth();

        setTimeout(() => {
            if (token && !hasAccess(roles, userRole)) {
                browserHistory.push('/');
            }
        }, 5000);
    }, []);

    console.log('isAuth', isAuth);
    return token ? (
        <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />
    ) : (
        <Redirect to="/login" />
    );
};

export default ProtectedRoute;
