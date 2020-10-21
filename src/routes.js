import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import PageLayout from './components/PageLayout';
import AuthPageLayout from './components/AuthPageLayout';
import Login from './signupLogin/login/components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './signupLogin/signup/components/Signup';
import { ROLES } from './signupLogin/constants';
import { auth } from './signupLogin/auth';
import UserProfile from './userProfile/profile/components/UserProfile';
import ResetPassword from './signupLogin/resetPassword/components/ResetPassword';
import Onboarding from './translateStack/onboarding/components/Onboarding';

export const ROUTE_PATHS = {
    home: '/',
    notFound: '*',
    app: {
        onboarding: '/onboarding',
    },
    auth: {
        me: '/me', // TODO add
        signup: '/signup',
        login: '/login',
        logout: '/logout',
        resetPassword: '/reset-password', // TODO add
        // passwordReset: '/password-reset/:token', // TODO add
        // accountSettings: '/account-settings',
    },
};

const Routes = ({ userRole, isNew }) => {
    return (
        <Switch>
            <ProtectedRoute
                path={ROUTE_PATHS.home}
                exact
                component={(matchProps) => (
                    <PageLayout Component={Home} {...matchProps} title="Home page" />
                )}
                roles={[ROLES.ADMIN]}
                userRole={userRole}
            />

            <ProtectedRoute
                path={ROUTE_PATHS.app.onboarding}
                exact
                component={(matchProps) => (
                    <PageLayout Component={Onboarding} {...matchProps} title="" isNew={isNew} />
                )}
                roles={[ROLES.ADMIN]}
                userRole={userRole}
            />
            <Route
                path={ROUTE_PATHS.auth.signup}
                exact
                render={(matchProps) => (
                    <AuthPageLayout
                        Component={Signup}
                        title="Create new account!"
                        headerLink={{
                            title: 'Log in',
                            to: ROUTE_PATHS.auth.login,
                        }}
                        {...matchProps}
                    />
                )}
            />

            <Route
                path={ROUTE_PATHS.auth.login}
                exact
                render={(matchProps) => (
                    <AuthPageLayout
                        Component={Login}
                        title="Login to your account"
                        headerLink={{
                            title: 'New? Sign up',
                            to: ROUTE_PATHS.auth.signup,
                        }}
                        {...matchProps}
                    />
                )}
            />

            <Route
                path={ROUTE_PATHS.auth.resetPassword}
                exact
                render={(matchProps) => (
                    <AuthPageLayout
                        Component={ResetPassword}
                        title="Reset your password"
                        {...matchProps}
                    />
                )}
            />

            <Route path={ROUTE_PATHS.notFound} exact component={PageNotFound} />
        </Switch>
    );
};

export default Routes;
