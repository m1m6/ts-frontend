import React, { useState } from 'react';
import { Col, Row, Avatar, Tabs, message } from 'antd';
import * as Yup from 'yup';
import classNames from 'classnames';
import { Form, Formik } from 'formik';
import { useMeQuery } from '../../../rootUseQuery';
import InputField from '../../../form/components/InputField';
import Button from '../../../form/components/Button';
import { useUpdateUserMetaDataMutation } from '../useMutations';
import { auth } from '../../../signupLogin/auth';
import { useCustomerCarsdQuery, useUserSubscriptionPlan } from '../../../user/useQueries';
import { capitalizeFirstLetter } from '../../../upgrade/utils';
import Upgrade from '../../../upgrade/components/Upgrade';
import Popup from '../../../components/Popup';
import InviteUser from './InviteUser';

const InputCustomStyle = {
    width: '22.7vw',
    height: '65px',
};

const Subscription = () => {
    // const { data, loading, error } = useMeQuery();
    const [showUpgradePopup, setShowUpgradePopup] = useState(false);
    const { data: userPlan, loading: userPlanLoading, error } = useUserSubscriptionPlan();
    const { data: customCards, loading: customCardsLoading } = useCustomerCarsdQuery();

    if (userPlanLoading || customCardsLoading) {
        return <></>;
    }

    const plan =
        userPlan && userPlan.getUserPlan && userPlan.getUserPlan.plan
            ? userPlan.getUserPlan.plan
            : { type: 'na', targetLanguages: 0, pages: 0 };

    let cards =
        customCards && customCards.getCustomerCard !== ''
            ? JSON.parse(customCards.getCustomerCard)
            : [];

    let cc,
        mon,
        year,
        type = '';

    if (cards && cards[0]) {
        cc = '**** **** **** ' + cards[0].last4;
        mon = cards[0].exp_month + '';
        year = cards[0].exp_year;
    }

    const initialValues = {
        plan: `${capitalizeFirstLetter(plan.type)} Plan (${plan.pages} Pages, ${
            plan.targetLanguages
        } Languages)`,
        cc: `${cc}         ${mon && mon.length === 1 ? `0${mon}` : mon} / ${year}`,
    };

    return (
        <Formik initialValues={initialValues}>
            {({ values, isSubmitting, dirty, errors }) => (
                <Form className="subscription-form">
                    <Row gutter={[48, 16]} style={{ width: '80%' }}>
                        <Col span={12} lg={12} md={12} sm={24} xs={24}>
                            <div>
                                <div className="field-name">Plan</div>
                                <InputField
                                    name="plan"
                                    type="text"
                                    style={InputCustomStyle}
                                    shouldShowError={false}
                                    disabled={true}
                                />
                            </div>
                        </Col>
                        <Col span={12} lg={12} md={12} sm={24} xs={24}>
                            <div>
                                <div className="field-name">
                                    Credit Card{' '}
                                    <span
                                        style={{
                                            float: 'right',
                                            fontSize: '14px',
                                            color: '#9966ff',
                                            cursor: 'pointer',
                                        }}
                                        onClick={(e) => setShowUpgradePopup(true)}
                                    >
                                        Change
                                    </span>
                                </div>
                                <InputField
                                    name="cc"
                                    type="text"
                                    disabled={true}
                                    style={InputCustomStyle}
                                    shouldShowError={false}
                                />
                            </div>
                        </Col>
                    </Row>

                    {showUpgradePopup && (
                        <Popup
                            component={() => {
                                return <Upgrade setShowPopup={setShowUpgradePopup} preStep={2} />;
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
                </Form>
            )}
        </Formik>
    );
};

const Team = () => {
    // show only for admin
    const [showInvitePopup, setShowInvitePopup] = useState(false);
    const { data: userData, loading: userDataLoading, error } = useMeQuery();
    const { data: customCards, loading: customCardsLoading } = useCustomerCarsdQuery();

    if (userDataLoading || customCardsLoading) {
        return <></>;
    }

    const user = userData && userData.me ? userData.me : { me: { email: '', fullName: '' } };

    let cards =
        customCards && customCards.getCustomerCard !== ''
            ? JSON.parse(customCards.getCustomerCard)
            : [];

    let cc,
        mon,
        year,
        type = '';

    if (cards && cards[0]) {
        cc = '**** **** **** ' + cards[0].last4;
        mon = cards[0].exp_month + '';
        year = cards[0].exp_year;
    }

    const initialValues = {
        member: `${user.fullName} (you)`,
        role: user.role,
    };

    return (
        <Formik initialValues={initialValues}>
            {({ values, isSubmitting, dirty, errors }) => (
                <Form className="subscription-form">
                    <Row gutter={[48, 16]} style={{ width: '80%' }}>
                        <Col span={12} lg={12} md={12} sm={24} xs={24}>
                            <div>
                                <div className="field-name">Member</div>
                                <InputField
                                    name="member"
                                    type="text"
                                    style={InputCustomStyle}
                                    shouldShowError={false}
                                    disabled={true}
                                />
                            </div>
                        </Col>
                        <Col span={12} lg={12} md={12} sm={24} xs={24}>
                            <div>
                                <div className="field-name">
                                    Role{' '}
                                    <span
                                        style={{
                                            float: 'right',
                                            fontSize: '14px',
                                            color: '#9966ff',
                                            cursor: 'pointer',
                                        }}
                                        onClick={(e) => setShowInvitePopup(true)}
                                    >
                                        Add User
                                    </span>
                                </div>
                                <InputField
                                    name="role"
                                    type="text"
                                    disabled={true}
                                    style={InputCustomStyle}
                                    shouldShowError={false}
                                />
                            </div>
                        </Col>
                    </Row>

                    {showInvitePopup && (
                        <Popup
                            component={() => {
                                return <InviteUser />;
                            }}
                            closePopup={(e) => setShowInvitePopup(false)}
                            style={{
                                minHeight: '700px',
                                width: '986px',
                                marginLeft: '0px',
                                marginRight: '0px',
                                margin: '0 auto',
                            }}
                        />
                    )}
                </Form>
            )}
        </Formik>
    );
};

const Profile = () => {
    const { data, loading, error } = useMeQuery();
    const [updateUser] = useUpdateUserMetaDataMutation();

    const initialValues = {
        email: '',
        password: '***********',
        fullName: '',
    };

    const updateUserSchema = Yup.object().shape({
        email: Yup.string().email('Please enter valid email').required('*Required'),
        fullName: Yup.string().required('*Required'),
        password: Yup.string().required('*Required'),
    });

    // if (loading) {
    //     return <></>;
    // }

    const { me } = data ? data : { me: { email: '', password: '', fullName: '' } };
    initialValues.email = me.email;
    initialValues.password = '***********';
    initialValues.fullName = me.fullName;
    return (
        <div className="settings-wrapper">
            <div className="settings-header">
                <span>Profile</span>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={updateUserSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        if (values.password === '***********') {
                            delete values.password;
                        }

                        const result = await updateUser({ variables: { ...values } });
                        if (result) {
                            if (
                                result.data &&
                                result.data.updateUserMetaData &&
                                result.data.updateUserMetaData.token
                            )
                                auth.logIn(result.data.updateUserMetaData.token);

                            message.success('Profile updated successfully');
                        }
                    } catch (error) {
                        setSubmitting(false);
                        message.warn('An error occured, please try again later.');
                    }
                }}
            >
                {({ values, isSubmitting, dirty, errors }) => (
                    <Form className="profile-form">
                        <Row gutter={[48, 16]} style={{ width: '80%' }}>
                            <Col span={12} lg={12} md={12} sm={24} xs={24}>
                                <div>
                                    <div className="field-name">Email</div>
                                    <InputField
                                        name="email"
                                        type="text"
                                        style={InputCustomStyle}
                                        shouldShowError={false}
                                    />
                                </div>
                            </Col>
                            <Col span={12} lg={12} md={12} sm={24} xs={24}>
                                <div>
                                    <div className="field-name">Full Name</div>
                                    <InputField
                                        name="fullName"
                                        type="text"
                                        style={InputCustomStyle}
                                        shouldShowError={false}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={[48, 16]}>
                            <Col span={12} lg={12} md={12} sm={24} xs={24}>
                                <div>
                                    <div className="field-name">Password</div>
                                    <InputField
                                        name="password"
                                        type="password"
                                        style={InputCustomStyle}
                                        shouldShowError={false}
                                    />
                                </div>
                            </Col>
                            <Col span={12} lg={12} md={12} sm={24} xs={24}>
                                {dirty && Object.keys(errors).length === 0 && (
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        disabled={isSubmitting}
                                        className={classNames('wf-btn-primary', {
                                            active: dirty && Object.keys(errors).length === 0,
                                        })}
                                        style={{ marginTop: '55px' }}
                                    >
                                        {isSubmitting ? 'UPDATING...' : <>UPDATE</>}
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

const Settings = ({}) => {
    return (
        <>
            <Profile />

            <div className="settings-wrapper">
                <div className="settings-header">Subscription</div>
                <Subscription />
            </div>

            <div className="settings-wrapper">
                <div className="settings-header">Team</div>
                <Team />
            </div>
        </>
    );
};

export default Settings;
