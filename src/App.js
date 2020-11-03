import React, { useEffect, useState } from 'react';
import Layout from './layout/Layout';
import Sidebar from './layout/Sidebar';
import Content from './layout/Content';
import Routes from './routes';
import { auth } from './signupLogin/auth';
import { useMeQuery } from './rootUseQuery';
import { Spin } from 'antd';
import { useUserData } from './signupLogin/login/useUserDataMutations';
import { useCustomizerQueryClient } from './translateStack/customizer/useQueries';
import { browserHistory } from './browserHistory';
import { useCustomizerMutationClient } from './translateStack/customizer/useMutations';

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
    if (loading || customizerLoading) {
        return <Spin spinning={loading} size="large" delay={500} />;
    }

    if (userRole === undefined && data && data.me) {
        setUserDataAsync();
    }

    const isNew = data && data.me ? data.me.isNew : false;
    const skippedOnboarding = data && data.me ? data.me.skippedOnboarding : false;
    const isOpenCustomizer =
        customizerData && customizerData.customizer ? customizerData.customizer.isOpen : false;

    if (token) {
        return (
            <Layout
                style={{
                    marginLeft:
                        (isNew && !skippedOnboarding) || isOpenCustomizer ? '323px' : '205px',
                    backgroundColor: 'rgba(247, 250, 252, 0.5)',
                }}
            >
                <Sidebar userRole={userRole} isOpenCustomizer={isOpenCustomizer} />
                <Content className="app-page-wrapper" id="app-page-wrapper-id">
                    <Routes
                        userRole={userRole}
                        isNew={isNew}
                        skippedOnboarding={skippedOnboarding}
                        isOpenCustomizer={isOpenCustomizer}
                    />
                </Content>
            </Layout>
        );
    } else {
        return <Routes />;
    }
};
export default App;
