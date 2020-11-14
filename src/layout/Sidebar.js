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
                />
            )}
            <div className="onboarding-title">Your integration guide</div>
            <div className="onboarding-steps">
                <Steps progressDot current={currentStep - 1} direction="vertical">
                    <Step
                        title="Source Language"
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
                        title="Targeted Languages"
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

const Sidebar = ({ isOpenCustomizer, openLanguagesComponent }) => {
    const { data, loading, error } = useMeQuery();
    const { data: onboardingData } = useOnboardingQueryClient();
    const [updateUser] = useUpdateUserMutation();
    const [updateOnboardingClient] = useOnboardingMutationClient();
    const [updateCustomizerClient] = useCustomizerMutationClient();
    let [activeMenu, setActiveMenu] = useState('Projects');
    const [progress, setProgress] = useState(70);

    useEffect(() => {
        if (loading) {
            setProgress(100);
        }
        return () => {
            setProgress(0);
        };
    }, []);

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
                    !skippedOnboarding &&
                    browserHistory.location.pathname.includes('onboarding')) ||
                isOpenCustomizer
                    ? 323
                    : 205
            }
            className="sidebar-wrapper"
        >
            <HeaderLogo />
            {isNew &&
            !skippedOnboarding &&
            browserHistory.location.pathname.includes('onboarding') ? (
                <OnboardingSteps
                    currentStep={currentStep}
                    updateOnboardingClient={updateOnboardingClient}
                />
            ) : isOpenCustomizer ? (
                <CustomizerSidebar openLanguagesComponent={openLanguagesComponent} />
            ) : (
                <div className="menu-wrapper">
                    <div
                        className={classNames('menu-item', {
                            activeMenu: activeMenu === 'Projects',
                        })}
                    >
                        <Link
                            to="/"
                            title="Projects"
                            onClick={(e) => setActiveMenu('Projects')}
                            className={classNames({
                                activeLink: activeMenu === 'Projects',
                            })}
                        >
                            Projects
                        </Link>
                    </div>
                    {isNew && (
                        <div className="menu-item">
                            <Link
                                title="Setup"
                                onClick={async (e) => {
                                    await updateOnboardingClient({ variables: { currentStep: 1 } });
                                    await updateUser({ variables: { skippedOnboarding: false } });
                                    browserHistory.push('/onboarding');
                                }}
                            >
                                Setup
                                <Rings
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        stroke: '#9966ff',
                                        verticalAlign: 'middle',
                                    }}
                                />
                            </Link>
                        </div>
                    )}

                    <div className="menu-item">
                        <Link
                            to="#"
                            title="Customizer"
                            onClick={async (e) => {
                                setActiveMenu('Projects');
                                e.preventDefault();
                                await updateCustomizerClient({ variables: { isOpen: true } });
                                browserHistory.push('/customizer');
                            }}
                        >
                            Customizer
                        </Link>
                    </div>

                    <div className="bottom-items">
                        <div
                            className={classNames('menu-item', {
                                activeMenu: activeMenu === 'Settings',
                            })}
                        >
                            <Link
                                to="/settings"
                                title="Settings"
                                onClick={(e) => setActiveMenu('Settings')}
                                className={classNames({
                                    activeLink: activeMenu === 'Settings',
                                })}
                            >
                                Settings
                            </Link>
                        </div>
                        <div className="menu-item">
                            <Link
                                to="#"
                                title="Log out"
                                onClick={(e) => {
                                    e.preventDefault();
                                    auth.removeAccessToken();
                                    window.location.reload();
                                }}
                            >
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
