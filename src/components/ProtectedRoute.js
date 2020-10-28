import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth } from '../signupLogin/auth';

const hasAccess = (roles, userRole) => {
    return roles.includes(userRole);
};

const ProtectedRoute = ({
    component: Component,
    userRole,
    isNew,
    roles,
    ...rest
}) => {
    const token = auth.getAccessToken();
    const [isAuth, setIsAuth] = useState(false);
    let isAuthorizedToAccess;

    useEffect(() => {
        setIsAuth(hasAccess(roles, userRole));
    }, [roles, userRole]);

    return token ? (
        <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />
    ) : (
        <Redirect to="/login" />
    );
};

export default ProtectedRoute;
