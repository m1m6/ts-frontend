import React, { useState } from 'react';
import { Rings } from 'svg-loaders-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Layout, Skeleton, Steps } from 'antd';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { useMeQuery, useMeQueryClient } from '../rootUseQuery';
import { useOnboardingQueryClient } from '../translateStack/onboarding/useQueries';
import { Link } from 'react-router-dom';
import Popup from '../components/Popup';
import Button from '../form/components/Button';
import InputField from '../form/components/InputField';
import Input from '../form/components/Input';

SyntaxHighlighter.registerLanguage('jsx', jsx);

const { Sider } = Layout;
const { Step } = Steps;

const HeaderLogo = () => {
    return (
        <div className="header-logo pointer" onClick={() => window.location.assign('/')}>
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
                    <Step title="Targeted Languages" />
                    <Step title="Your Domain" />
                    <Step title="Installation" />
                </Steps>
            </div>
        </div>
    );
};

const SetupPopup = () => {
    return (
        <div className="setup-popup-wrapper">
            <div className="setup-p-title">Set up</div>
            <div className="setup-p-description">
                Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                Journals und Research Paper stützt. Verwende dafür fundierte Quellen und Online
                Bibliotheken, die wir dir unten aufgeführt haben.
            </div>
            <div className="setup-p-code">
                <div className="setup-code">
                    <Button children="COPY" />
                    <SyntaxHighlighter language="javascript" style={dark}>
                        {`
    const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
        price: 'price_1HKiSf2eZvKYlo2CxjF9qwbr',
        quantity: 1,
        }],
        mode: 'subscription',
        success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/cancel',
    });`}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="setup-p-d-w">
                <div className="setup-p-d-t">Choose your domain</div>
                <div className="setup-p-d-d">
                    Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                    Journals und Research Paper stützt. Verwend
                </div>
                <div className="setup-p-d-i">
                    <Input placeholder="https://yourwebsite.com"/>
                </div>
                <div className="setup-p-d-s">
                    <Button className="wf-btn-primary" children="TEST SETUP" />
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ routerHistory }) => {
    const [showPopup, setShowPopup] = useState(false);
    const { data, loading, error } = useMeQuery();
    const { data: onboardingData } = useOnboardingQueryClient();

    if (loading) {
        return <Skeleton active loading paragraph />;
    }

    const {
        me: { isNew, pages },
    } = data;

    let currentStep =
        onboardingData && onboardingData.onboarding ? onboardingData.onboarding.currentStep : 1;

    return (
        <Sider width={isNew ? 323 : 205} className="sidebar-wrapper">
            <HeaderLogo />
            {isNew && <OnboardingSteps currentStep={currentStep} />}
            {!isNew && (
                <div className="menu-wrapper">
                    <div className="menu-item">
                        <Link to="/projects" title="Projects">
                            Projects
                        </Link>
                    </div>
                    {/* {!pages && !pages.length && ( */}
                    <div className="menu-item">
                        <Link
                            title="Setup"
                            onClick={(e) => {
                                setShowPopup(true);
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
                    {/* )} */}

                    <div className="menu-item">
                        <Link to="/customizer" title="Customizer">
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
                            <Link to="/logout" title="Log out">
                                Log out
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {showPopup && (
                <Popup text="test" component={SetupPopup} closePopup={(e) => setShowPopup(false)} />
            )}
        </Sider>
    );
};

export default Sidebar;
