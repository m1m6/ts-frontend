import React from 'react';
import { Layout, Skeleton, Steps } from 'antd';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { useMeQueryClient } from '../rootUseQuery';
import { isAdmin } from '../signupLogin/utils';
import GoBack from '../components/GoBack';

const { Sider } = Layout;
const { Step } = Steps;

const HeaderLogo = () => {
    return (
        <div className="header-logo pointer" onClick={() => window.location.assign('/')}>
            <Logo className="onboarding-header" fill="#ccc" />
        </div>
    );
};

const OnboardingSteps = () => {
    return (
        <div className="onboarding-wrapper">
            <div className="onboarding-title">Your integration guide</div>
            <div className="onboarding-steps">
                <Steps progressDot current={1} direction="vertical">
                    <Step
                        title="Targeted Languages"
                    />
                    <Step
                        title="Your Domain"
                    />
                    <Step
                        title="Installation"
                    />
                </Steps>
            </div>
        </div>
    );
};

const Sidebar = ({ routerHistory }) => {
    const { loading, error, data } = useMeQueryClient();

    if (loading) {
        return <Skeleton active loading paragraph />;
    }

    const {
        me: { role, email, name, isNew },
    } = data;

    let isAdminUser = isAdmin(role);

    return (
        <Sider width={isNew ? 323 : 205} className="sidebar-wrapper">
            <HeaderLogo />
            {
                isNew && <OnboardingSteps />
            }
           
        </Sider>
    );
};

export default Sidebar;
