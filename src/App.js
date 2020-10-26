import React, { useState } from 'react';
import Layout from './layout/Layout';
import Sidebar from './layout/Sidebar';
import Content from './layout/Content';
import Routes from './routes';
import { auth } from './signupLogin/auth';
import { useMeQuery } from './rootUseQuery';
import { Spin } from 'antd';
import { useUserData } from './signupLogin/login/useUserDataMutations';

const token = auth.getAccessToken();

const App = () => {
    const { loading, data, error } = useMeQuery();
    const [userRole, setUserRole] = useState(undefined);

    const [setUserData] = useUserData();

    async function setUserDataAsync() {
        if (!loading) {
            const { id, fullName, email, role, isNew } = data.me;
            setUserRole(role);
            await setUserData({ variables: { id, fullName, email, role, isNew } });
        }
    }

    if (loading) {
        return <Spin spinning={loading} size="large" delay={500} />;
    }

    if (userRole === undefined && data && data.me) {
        setUserDataAsync();
    }

    const isNew = data && data.me ? data.me.isNew : false;
    if (token) {
        return (
            <Layout style={{ marginLeft: isNew ? '323px' : '205px', backgroundColor: 'rgba(247, 250, 252, 0.5)' }}>
                <Sidebar userRole={userRole} />
                <Content className="app-page-wrapper" id="app-page-wrapper-id">
                    <Routes userRole={userRole} isNew={isNew} />
                </Content>
            </Layout>
        );
    } else {
        return <Routes />;
    }
};
export default App;
