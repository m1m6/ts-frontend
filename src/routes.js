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
import Projects from './translateStack/projects/components/Projects';
import Translation from './translateStack/translation/components/Translation';
import Customizer from './translateStack/customizer/components/Customizer';
import Settings from './userProfile/profile/components/Settings';

export const ROUTE_PATHS = {
    home: '/',
    notFound: '*',
    app: {
        onboarding: '/onboarding',
        translation: '/translation',
        customizer: '/customizer',
        settings: '/settings',
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

const Routes = ({ userRole, isNew, skippedOnboarding, isOpenCustomizer }) => {
    return (
        <Switch>
            <ProtectedRoute
                path={ROUTE_PATHS.home}
                exact
                component={(matchProps) => (
                    <PageLayout
                        Component={Projects}
                        {...matchProps}
                        title="Projects"
                        isOpenCustomizer={isOpenCustomizer}
                    />
                )}
                roles={[ROLES.ADMIN, ROLES.EDITOR, ROLES.DEVELOPER]}
                userRole={userRole}
            />

            <ProtectedRoute
                path={ROUTE_PATHS.app.onboarding}
                exact
                component={(matchProps) => (
                    <PageLayout
                        Component={Onboarding}
                        {...matchProps}
                        title=""
                        isNew={isNew}
                        skippedOnboarding={skippedOnboarding}
                        isOpenCustomizer={isOpenCustomizer}
                    />
                )}
                roles={[ROLES.ADMIN, ROLES.DEVELOPER]}
                userRole={userRole}
                isNew={isNew}
                skippedOnboarding={skippedOnboarding}
            />

            <ProtectedRoute
                path={ROUTE_PATHS.app.translation}
                exact
                component={(matchProps) => (
                    <PageLayout
                        Component={Translation}
                        {...matchProps}
                        title=""
                        isOpenCustomizer={isOpenCustomizer}
                    />
                )}
                roles={[ROLES.ADMIN, ROLES.EDITOR]}
                userRole={userRole}
            />

            <ProtectedRoute
                path={ROUTE_PATHS.app.customizer}
                exact
                component={(matchProps) => (
                    <PageLayout
                        Component={Customizer}
                        {...matchProps}
                        title=""
                        isOpenCustomizer={isOpenCustomizer}
                    />
                )}
                roles={[ROLES.ADMIN, ROLES.DEVELOPER]}
                userRole={userRole}
            />

            <ProtectedRoute
                path={ROUTE_PATHS.app.settings}
                exact
                component={(matchProps) => (
                    <PageLayout
                        Component={Settings}
                        {...matchProps}
                        title=""
                        isNew={isNew}
                        skippedOnboarding={skippedOnboarding}
                        isOpenCustomizer={isOpenCustomizer}
                        userRole={userRole}
                    />
                )}
                roles={[ROLES.ADMIN, ROLES.EDITOR, ROLES.DEVELOPER]}
                userRole={userRole}
                isNew={isNew}
                skippedOnboarding={skippedOnboarding}
            />

            <Route
                path={ROUTE_PATHS.auth.signup}
                exact
                render={(matchProps) => (
                    <AuthPageLayout
                        Component={Signup}
                        title="Create new account"
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
