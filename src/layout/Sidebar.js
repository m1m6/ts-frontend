import React from 'react';
import { Rings } from 'svg-loaders-react';
import { Layout, Steps } from 'antd';
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

const { Sider } = Layout;
const { Step } = Steps;

const HeaderLogo = () => {
    return (
        <div className="header-logo pointer" onClick={() => browserHistory.push('/')}>
            <Logo className="onboarding-header" fill="#ccc" />
        </div>
    );
};

const OnboardingSteps = ({ currentStep }) => {
    return (
        <div className="onboarding-wrapper">
            <div className="onboarding-title">Your integration guide</div>
            <div className="onboarding-steps">
                <Steps progressDot current={currentStep - 1} direction="vertical">
                    <Step title="Source Language" />
                    <Step title="Targeted Languages" />
                    <Step title="Your Domain" />
                    <Step title="Installation" />
                </Steps>
            </div>
        </div>
    );
};

const Sidebar = ({ isOpenCustomizer }) => {
    const { data, loading, error } = useMeQuery();
    const { data: onboardingData } = useOnboardingQueryClient();
    const [updateUser] = useUpdateUserMutation();
    const [updateOnboardingClient] = useOnboardingMutationClient();
    const [updateCustomizerClient] = useCustomizerMutationClient();

    if (loading) {
        return <></>;
    }

    const {
        me: { isNew, skippedOnboarding, pages },
    } = data;

    let currentStep =
        onboardingData && onboardingData.onboarding ? onboardingData.onboarding.currentStep : 1;

    return (
        <Sider
            width={(isNew && !skippedOnboarding) || isOpenCustomizer ? 323 : 205}
            className="sidebar-wrapper"
        >
            <HeaderLogo />
            {isNew && !skippedOnboarding ? (
                <OnboardingSteps currentStep={currentStep} />
            ) : isOpenCustomizer ? (
                <CustomizerSidebar />
            ) : (
                <div className="menu-wrapper">
                    <div className="menu-item">
                        <Link to="/" title="Projects">
                            Projects
                        </Link>
                    </div>
                    {skippedOnboarding && isNew && (
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
                                e.preventDefault();
                                await updateCustomizerClient({ variables: { isOpen: true } });
                                browserHistory.push('/customizer');
                            }}
                        >
                            Customizer
                        </Link>
                    </div>

                    <div className="bottom-items">
                        <div className="menu-item">
                            <Link to="/settings" title="Settings">
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
