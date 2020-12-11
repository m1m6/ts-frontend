import React, { useState } from 'react';
import { Col, Row, Avatar, Tabs, message } from 'antd';
import { Grid } from 'svg-loaders-react';
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
import { useTeamMembersQuery } from '../userQueries';
import Input from '../../../form/components/Input';
import AddCreditCard from './AddCreditCard';
import { isAdmin } from '../../../signupLogin/utils';

const InputCustomStyle = {
    width: '22.7vw',
    height: '65px',
};

const Subscription = () => {
    const [showUpgradePopup, setShowUpgradePopup] = useState(false);
    const [showCreditCardPopup, setShowCreditCardPopup] = useState(false);

    const { data: userPlan, loading: userPlanLoading, error } = useUserSubscriptionPlan();
    const { data: customCards, loading: customCardsLoading } = useCustomerCarsdQuery();

    if (userPlanLoading || customCardsLoading) {
        return <Grid style={{ marginLeft: '45%', fill: '#9966ff' }} />;
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
        cc: `${cc || 'N/A'}         ${mon && mon.length === 1 ? `0${mon}` : mon || 'N/A'} / ${
            year || 'N/A'
        }`,
    };

    let subscriptionCycle =
        userPlan && userPlan.getUserPlan && userPlan.getUserPlan.subscriptionCycle
            ? userPlan.getUserPlan.subscriptionCycle
            : 'yearly';

    let targetPlan = plan.id !== 4 ? plan.id + 1 : plan.id;
    return (
        <Formik initialValues={initialValues}>
            {({ values, isSubmitting, dirty, errors }) => (
                <Form className="subscription-form">
                    <Row gutter={[48, 16]} style={{ width: '80%' }}>
                        <Col span={12} lg={12} md={12} sm={24} xs={24}>
                            <div>
                                <div className="field-name">
                                    Plan
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
                                        onClick={(e) => setShowCreditCardPopup(true)}
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
                                return (
                                    <Upgrade
                                        setShowPopup={setShowUpgradePopup}
                                        targetPlan={targetPlan}
                                        preStep={2}
                                        subscriptionCycle={subscriptionCycle}
                                        successCB={async () => {
                                            setShowUpgradePopup(false);
                                        }}
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

                    {showCreditCardPopup && (
                        <Popup
                            component={() => {
                                return <AddCreditCard setShowPopup={setShowCreditCardPopup} />;
                            }}
                            closePopup={(e) => setShowCreditCardPopup(false)}
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
    const [showInvitePopup, setShowInvitePopup] = useState(false);
    const { data: userData, loading: userDataLoading, error } = useMeQuery();
    const { data: team } = useTeamMembersQuery();

    if (userDataLoading) {
        return <Grid style={{ marginLeft: '45%', fill: '#9966ff' }} />;
    }

    const user = userData && userData.me ? userData.me : { me: { email: '', fullName: '' } };

    let teamMembers = team && team.teamMembers ? JSON.parse(JSON.stringify(team.teamMembers)) : [];

    const filteredMembers = teamMembers.filter((member) => member.email !== user.email);

    if (filteredMembers.length !== 1) {
        filteredMembers.unshift(user);
    }

    return (
        <div>
            <div className="subscription-form">
                {teamMembers.reverse().map((member, index) => {
                    return (
                        <Row gutter={[48, 16]} style={{ width: '80%' }}>
                            <Col span={12} lg={12} md={12} sm={24} xs={24}>
                                <div>
                                    {index === 0 && <div className="field-name">Member</div>}
                                    <Input
                                        name="member"
                                        type="text"
                                        style={InputCustomStyle}
                                        disabled={true}
                                        value={member.fullName + ' ' + (index == 0 ? '(you)' : '')}
                                    />
                                </div>
                            </Col>
                            <Col span={12} lg={12} md={12} sm={24} xs={24}>
                                <div>
                                    <div className="field-name">
                                        {index === 0 && (
                                            <div className="field-name">
                                                Role
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
                                        )}
                                    </div>
                                    <Input
                                        name="role"
                                        type="text"
                                        disabled={true}
                                        style={InputCustomStyle}
                                        value={member.role}
                                    />
                                </div>
                            </Col>
                        </Row>
                    );
                })}

                {showInvitePopup && (
                    <Popup
                        component={() => {
                            return <InviteUser close={setShowInvitePopup} />;
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
            </div>
        </div>
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
                            delete values.password; // stupid hack
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
                                        {isSubmitting ? (
                                            <Grid style={{ width: '17px', height: '17px' }} />
                                        ) : (
                                            <>UPDATE</>
                                        )}
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
    const { data, loading, error } = useMeQuery();

    if (loading) return <></>;

    const role = data.me.role;

    const isAdminUser = isAdmin(role);
    return (
        <>
            <Profile />

            {isAdminUser && (
                <>
                    <div className="settings-wrapper">
                        <div className="settings-header">Subscription</div>
                        <Subscription />
                    </div>
                    <div className="settings-wrapper">
                        <div className="settings-header">Team</div>
                        <Team />
                    </div>
                </>
            )}
        </>
    );
};

export default Settings;
