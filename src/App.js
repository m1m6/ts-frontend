import React, { useEffect, useState } from 'react';
import { differenceInDays } from 'date-fns';
import Layout from './layout/Layout';
import Sidebar from './layout/Sidebar';
import Content from './layout/Content';
import Routes from './routes';
import { auth } from './signupLogin/auth';
import { useMeQuery } from './rootUseQuery';
import { useCustomizerQueryClient } from './translateStack/customizer/useQueries';
import { browserHistory } from './browserHistory';
import {
    useCustomizerMutation,
    useCustomizerMutationClient,
} from './translateStack/customizer/useMutations';
import { useUserSubscriptionPlan } from './user/useQueries';
import Button from './form/components/Button';
import Link from './form/components/Link';
import Upgrade from './upgrade/components/Upgrade';
import Popup from './components/Popup';
import { ReactComponent as Stars } from './assets/stars.svg';
import { useUpgradeDataQueryClient } from './upgrade/useQuery';
import { useSetUpgradeDataClient } from './upgrade/useMutation';

const token = auth.getAccessToken();

const App = () => {
    const { loading, data, error } = useMeQuery();
    const { data: customizerData, loading: customizerLoading } = useCustomizerQueryClient();
    const [updateCustomizerClient] = useCustomizerMutationClient();
    const [bannerVisible, setBannerVisible] = useState(false);

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

    const isNew = data && data.me ? data.me.isNew : false;
    const skippedOnboarding = data && data.me ? data.me.skippedOnboarding : false;
    const isOpenCustomizer =
        customizerData && customizerData.customizer ? customizerData.customizer.isOpen : false;

    // stupid hack!
    const userRole = data && data.me ? data.me.role : 'ADMIN';
    const openLanguagesComponent =
        customizerData && customizerData.customizer
            ? customizerData.customizer.openLanguagesComponent
            : false;

    const subscriptionCycle = data && data.me ? data.me.subscriptionCycle : '';
    const numberOfPages = data && data.me ? data.me.pages : 0;
    if (token) {
        return (
            <>
                <Banner
                    setBannerVisible={setBannerVisible}
                    bannerVisible={bannerVisible}
                    subscriptionCycle={subscriptionCycle}
                    numberOfPages={numberOfPages}
                />
                <Layout
                    style={{
                        marginLeft:
                            (isNew &&
                                // !skippedOnboarding &&
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
                        bannerVisible={bannerVisible}
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

const Banner = ({ setBannerVisible, bannerVisible, subscriptionCycle, numberOfPages }) => {
    const [showUpgradePopup, setShowUpgradePopup] = useState(false);
    const { data: userPlan, loading } = useUserSubscriptionPlan();
    const { data: upgradeData, loading: upgradeLoading } = useUpgradeDataQueryClient();
    const [updateUpgradeData] = useSetUpgradeDataClient();
    const [updateCustomizerClient] = useCustomizerMutationClient();

    if (loading || upgradeLoading) {
        return <></>;
    }

    let { isInTrialPeriod, trialEnds } = userPlan.getUserPlan;
    let shouldShowPopup = upgradeData.upgrade.shouldShowUpgradePopup || showUpgradePopup;

    let targetPlan = upgradeData.upgrade.targetPlan;

    const shouldShowBanner =
        numberOfPages.length > 0 &&
        userPlan &&
        userPlan.getUserPlan &&
        userPlan.getUserPlan.plan &&
        userPlan.getUserPlan.plan.id === 1
            ? true
            : false;

    const userStatus = shouldShowBanner ? userPlan.getUserPlan.status : '';
    const userPlanData = shouldShowBanner ? userPlan.getUserPlan.plan : {};

    if (shouldShowBanner && userStatus === 'BASIC' && bannerVisible === false) {
        setBannerVisible(true);
    }

    let now = Date.now();
    let difference = isInTrialPeriod ? differenceInDays(new Date(trialEnds), now) : 30;

    return (
        <div
            style={{
                marginBottom: shouldShowBanner && userStatus === 'BASIC' ? '50px' : 0,
            }}
        >
            {shouldShowBanner && userStatus === 'BASIC' && (
                <>
                    <div
                        style={{
                            width: '100%',
                            height: '49px',
                            top: '0px',
                            backgroundColor: '#a172ff',
                            textAlign: 'center',
                            position: 'fixed',
                            zIndex: 10,
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
                            Enjoy more features in higher plans like adding more languages or to
                            remove the branding.
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
                            to="/settings"
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

            {shouldShowPopup && (
                <Popup
                    component={() => {
                        return (
                            <Upgrade
                                successCB={async () => {
                                    setShowUpgradePopup(false);
                                    await updateUpgradeData({
                                        variables: {
                                            shouldShowUpgradePopup: false,
                                            shouldResetUpgradeData: false,
                                        },
                                    });
                                }}
                                // preStep={userStatus !==   'BASIC' && userStatus !== 'PREMIUM' ? 3 : 1}
                                subscriptionCycle={subscriptionCycle}
                                targetPlan={targetPlan}
                            />
                        );
                    }}
                    closePopup={async (e) => {
                        setShowUpgradePopup(false);
                        await updateUpgradeData({
                            variables: {
                                shouldShowUpgradePopup: false,
                                shouldResetUpgradeData: true,
                            },
                        });

                        await updateCustomizerClient({
                            variables: {
                                removedItems: [],
                                languages: null,
                            },
                        });
                    }}
                    style={{
                        minHeight: '700px',
                        width: '986px',
                        marginLeft: '0px',
                        marginRight: '0px',
                        margin: '0 auto',
                        zIndex: 1000000
                    }}
                />
            )}
        </div>
    );
};
export default App;
