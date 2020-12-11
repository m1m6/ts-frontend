import React, { useEffect, useState } from 'react';
import { Rings } from 'svg-loaders-react';
import { Layout, Steps } from 'antd';
import classNames from 'classnames';
import { ReactComponent as Logo } from '../assets/logo.svg';

import { useMeQuery } from '../rootUseQuery';
import { useOnboardingQueryClient } from '../translateStack/onboarding/useQueries';
import { Link } from 'react-router-dom';
import { useOnboardingMutationClient } from '../translateStack/onboarding/useMutations';
import { browserHistory } from '../browserHistory';
import { useUpdateUserMutation } from '../user/useMutations';
import { auth } from '../signupLogin/auth';
import { useCustomizerMutationClient } from '../translateStack/customizer/useMutations';
import GoBack from '../components/GoBack';
import { ReactComponent as RightArrow } from '../assets/right-arrow-angle.svg';
import CustomizerSidebar from './CustomizerSidebar';
import LoadingBar from 'react-top-loading-bar';
import { isAdmin, isDeveloper, isEditor } from '../signupLogin/utils';

const { Sider } = Layout;
const { Step } = Steps;

const HeaderLogo = () => {
    return (
        <div
            className="header-logo pointer"
            onClick={() => {
                if (!window.location.pathname.includes('/onboarding')) {
                    browserHistory.push('/');
                }
            }}
        >
            <Logo className="onboarding-header" fill="#ccc" />
        </div>
    );
};

const OnboardingSteps = ({ currentStep, updateOnboardingClient }) => {
    return (
        <div className="onboarding-wrapper">
            {currentStep > 1 && (
                <GoBack
                    onClickCB={async (e) => {
                        await updateOnboardingClient({
                            variables: { currentStep: currentStep - 1 },
                        });
                    }}
                    style={{
                        top: '100px',
                        position: 'fixed',
                    }}
                />
            )}
            <div className="onboarding-title">Your integration guide</div>
            <div className="onboarding-steps">
                <Steps progressDot current={currentStep - 1} direction="vertical">
                    <Step
                        title="Root Language"
                        onClick={async (e) => {
                            await updateOnboardingClient({
                                variables: { currentStep: 1 },
                            });
                        }}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <Step
                        title="New Languages"
                        onClick={async (e) => {
                            await updateOnboardingClient({
                                variables: { currentStep: 2 },
                            });
                        }}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <Step
                        title="Your Domain"
                        onClick={async (e) => {
                            await updateOnboardingClient({
                                variables: { currentStep: 3 },
                            });
                        }}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <Step
                        title="Installation"
                        onClick={async (e) => {
                            await updateOnboardingClient({
                                variables: { currentStep: 4 },
                            });
                        }}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                </Steps>
            </div>
        </div>
    );
};

const Sidebar = ({ isOpenCustomizer, openLanguagesComponent, bannerVisible, userRole }) => {
    let [activeMenu, setActiveMenu] = useState(
        window.location.pathname.includes('settings') ? 'Settings' : 'Projects'
    );
    const [progress, setProgress] = useState(70);
    const { data, loading, error } = useMeQuery();
    const { data: onboardingData } = useOnboardingQueryClient();
    const [updateUser] = useUpdateUserMutation();
    const [updateOnboardingClient] = useOnboardingMutationClient();
    const [updateCustomizerClient] = useCustomizerMutationClient();

    if (loading) {
        return (
            <LoadingBar
                color="#a172ff"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
        );
    }

    const {
        me: { isNew, skippedOnboarding, pages },
    } = data;

    let currentStep =
        onboardingData && onboardingData.onboarding ? onboardingData.onboarding.currentStep : 1;

    return (
        <Sider
            width={
                (isNew &&
                    // !skippedOnboarding &&
                    browserHistory.location.pathname.includes('onboarding')) ||
                isOpenCustomizer
                    ? 323
                    : 205
            }
            className="sidebar-wrapper"
        >
            <HeaderLogo />
            {isNew &&
            // !skippedOnboarding &&
            browserHistory.location.pathname.includes('onboarding') ? (
                <>
                    <OnboardingSteps
                        currentStep={currentStep}
                        updateOnboardingClient={updateOnboardingClient}
                    />
                </>
            ) : isOpenCustomizer ? (
                <CustomizerSidebar
                    openLanguagesComponent={openLanguagesComponent}
                    bannerVisible={bannerVisible}
                />
            ) : (
                <div className="menu-wrapper">
                    <div
                        className={classNames('menu-item', {
                            activeMenu: activeMenu === 'Projects',
                        })}
                        onClick={(e) => {
                            setActiveMenu('Projects');
                            browserHistory.push('/');
                        }}
                    >
                        <Link
                            to="#"
                            title="Projects"
                            className={classNames({
                                activeLink: activeMenu === 'Projects',
                            })}
                        >
                            Projects
                        </Link>
                    </div>
                    {isNew && !isEditor(userRole) && (
                        <div
                            className="menu-item"
                            onClick={async (e) => {
                                await updateOnboardingClient({
                                    variables: { currentStep: 1 },
                                });
                                await updateUser({
                                    variables: { skippedOnboarding: false },
                                });
                                browserHistory.push('/onboarding');
                            }}
                        >
                            <Link title="Setup">Setup</Link>
                            <div className="ring-container">
                                <div className="ringring"></div>
                                <div className="circle"></div>
                            </div>
                        </div>
                    )}

                    {!isEditor(userRole) && (
                        <div
                            className="menu-item"
                            onClick={async (e) => {
                                setActiveMenu('Projects');
                                e.preventDefault();
                                await updateCustomizerClient({ variables: { isOpen: true } });
                                browserHistory.push('/customizer');
                            }}
                        >
                            <Link to="#" title="Customizer">
                                Customizer
                            </Link>
                        </div>
                    )}

                    <div
                        className="bottom-items"
                        style={{ bottom: bannerVisible ? '80px' : '30px' }}
                    >
                        {(isAdmin(userRole) || isEditor(userRole) || isDeveloper(userRole)) && (
                            <div
                                className={classNames('menu-item', {
                                    activeMenu: activeMenu === 'Settings',
                                })}
                                onClick={(e) => {
                                    setActiveMenu('Settings');
                                    browserHistory.push('/settings');
                                }}
                            >
                                <Link
                                    to="#"
                                    title="Settings"
                                    className={classNames({
                                        activeLink: activeMenu === 'Settings',
                                    })}
                                >
                                    Settings
                                </Link>
                            </div>
                        )}
                        <div
                            className="menu-item"
                            onClick={(e) => {
                                e.preventDefault();
                                auth.removeAccessToken();
                                window.location.reload();
                            }}
                        >
                            <Link to="#" title="Log out">
                                Log out
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </Sider>
    );
};

export default Sidebar;
