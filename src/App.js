import React, { useEffect, useState } from 'react';
import Layout from './layout/Layout';
import Sidebar from './layout/Sidebar';
import Content from './layout/Content';
import Routes from './routes';
import { auth } from './signupLogin/auth';
import { useMeQuery } from './rootUseQuery';
import { useUserData } from './signupLogin/login/useUserDataMutations';
import { useCustomizerQueryClient } from './translateStack/customizer/useQueries';
import { browserHistory } from './browserHistory';
import { useCustomizerMutationClient } from './translateStack/customizer/useMutations';
import { useUserSubscriptionPlan } from './user/useQueries';
import Button from './form/components/Button';
import Link from './form/components/Link';
import Upgrade from './upgrade/components/Upgrade';
import Popup from './components/Popup';
import { ReactComponent as Stars } from './assets/stars.svg';

const token = auth.getAccessToken();

const App = () => {
    const { loading, data, error } = useMeQuery();
    const [userRole, setUserRole] = useState(undefined);
    const { data: customizerData, loading: customizerLoading } = useCustomizerQueryClient();
    const [updateCustomizerClient] = useCustomizerMutationClient();

    const [setUserData] = useUserData();

    async function setUserDataAsync() {
        if (!loading) {
            const { id, fullName, email, role, isNew } = data.me;
            setUserRole(role);
            await setUserData({ variables: { id, fullName, email, role, isNew } });
        }
    }

    async function updateCustomizerData(isOpen) {
        await updateCustomizerClient({ variables: { isOpen } });
    }

    useEffect(() => {
        if (
            !customizerLoading &&
            browserHistory.location.pathname.includes('/customizer') &&
            customizerData &&
            customizerData.customizer &&
            customizerData.customizer.isOpen === false
        ) {
            updateCustomizerData(true);
        }
    }, []);
    // if (loading || customizerLoading) {
    //     return <></>;
    // }

    if (userRole === undefined && data && data.me) {
        setUserDataAsync();
    }

    const isNew = data && data.me ? data.me.isNew : false;
    const skippedOnboarding = data && data.me ? data.me.skippedOnboarding : false;
    const isOpenCustomizer =
        customizerData && customizerData.customizer ? customizerData.customizer.isOpen : false;

    const openLanguagesComponent =
        customizerData && customizerData.customizer
            ? customizerData.customizer.openLanguagesComponent
            : false;

    if (token) {
        return (
            <>
                <Banner />
                <Layout
                    style={{
                        marginLeft:
                            (isNew &&
                                !skippedOnboarding &&
                                browserHistory.location.pathname.includes('onboarding')) ||
                            isOpenCustomizer
                                ? '323px'
                                : '205px',
                        backgroundColor: 'rgba(247, 250, 252, 0.5)',
                    }}
                >
                    <Sidebar
                        userRole={userRole}
                        isOpenCustomizer={isOpenCustomizer}
                        openLanguagesComponent={openLanguagesComponent}
                    />
                    <Content className="app-page-wrapper" id="app-page-wrapper-id">
                        <Routes
                            userRole={userRole}
                            isNew={isNew}
                            skippedOnboarding={skippedOnboarding}
                            isOpenCustomizer={isOpenCustomizer}
                        />
                    </Content>
                </Layout>
            </>
        );
    } else {
        return <Routes />;
    }
};

const Banner = () => {
    const [showUpgradePopup, setShowUpgradePopup] = useState(false);
    const { data: userPlan, loading } = useUserSubscriptionPlan();

    if (loading) {
        return <></>;
    }

    const shouldShowBanner =
        userPlan &&
        userPlan.getUserPlan &&
        userPlan.getUserPlan.plan &&
        userPlan.getUserPlan.plan.id > 1
            ? true
            : false;

    const userStatus = shouldShowBanner ? userPlan.getUserPlan.status : '';
    const userPlanData = shouldShowBanner ? userPlan.getUserPlan.plan : {};

    return (
        <div>
            {shouldShowBanner && userStatus === 'BASIC' && (
                <>
                    <div
                        style={{
                            width: '100%',
                            height: '49px',
                            top: '0px',
                            backgroundColor: '#a172ff',
                            textAlign: 'center',
                        }}
                    >
                        <Stars style={{ width: '13px', height: '13px', marginRight: '6px' }} />
                        <span
                            style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                lineHeight: '3.36',
                            }}
                        >
                            You are using features of the {userPlanData.type.toLowerCase()} plan.
                            Upgrade now to continue using those. 30 days left.
                        </span>
                        <span>
                            <Button
                                children="UPGRADE NOW"
                                style={{
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    marginLeft: '17px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: '#9966ff',
                                    width: '117px',
                                    height: '31px',
                                    textAlign: 'center',
                                    border: 0,
                                    cursor: 'pointer',
                                    outline: 0,
                                    marginTop: '10px',
                                }}
                                onClick={() => {
                                    setShowUpgradePopup(true);
                                }}
                            />
                        </span>
                        <Link
                            to="#"
                            label="Learn More"
                            style={{
                                marginLeft: '20px',
                                textDecoration: 'underline',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 'bold',
                            }}
                        />
                    </div>
                </>
            )}

            {showUpgradePopup && (
                <Popup
                    component={() => {
                        return (
                            <Upgrade
                                setShowPopup={setShowUpgradePopup}
                                preStep={userStatus !== 'BASIC' ? 3 : 1}
                            />
                        );
                    }}
                    closePopup={(e) => setShowUpgradePopup(false)}
                    style={{
                        minHeight: '700px',
                        width: '986px',
                        marginLeft: '0px',
                        marginRight: '0px',
                        margin: '0 auto',
                    }}
                />
            )}
        </div>
    );
};
export default App;
