import React from 'react';
import { Col, Row, Avatar, Tabs, message } from 'antd';
import * as Yup from 'yup';
import classNames from 'classnames';
import { Form, Formik } from 'formik';
import { useMeQuery } from '../../../rootUseQuery';
import InputField from '../../../form/components/InputField';
import Button from '../../../form/components/Button';
import { useUpdateUserMetaDataMutation } from '../useMutations';
import { auth } from '../../../signupLogin/auth';

const InputCustomStyle = {
    width: '22.7vw',
    height: '65px',
};

const Subscription = () => {
    return (
        <Formik
        // initialValues={initialValues}
        // validationSchema={loginSchema}
        // onSubmit={async (values, { setSubmitting }) => {
        //     try {
        //         const result = await login({ variables: { ...values } });
        //         if (result) {
        //             auth.logIn(result.data.login.token);
        //             if (isAdmin(result.data.login.user.role))
        //                 // and first time
        //                 window.location.assign('/onboarding');
        //             else {
        //                 // go to dashboard
        //                 window.location.assign('/home');
        //             }
        //         }
        //     } catch (error) {
        //         setSubmitting(false);
        //         showAllGraphQLErrors(error.graphQLErrors);
        //     }
        // }}
        >
            {({ values, isSubmitting, dirty, errors }) => (
                <Form className="subscription-form">
                    <Row gutter={[48, 16]} style={{ width: '80%' }}>
                        Coming sooon...
                    </Row>
                </Form>
            )}
        </Formik>
    );
};

const Team = () => {
    return (
        <Formik
        // initialValues={initialValues}
        // validationSchema={loginSchema}
        // onSubmit={async (values, { setSubmitting }) => {
        //     try {
        //         const result = await login({ variables: { ...values } });
        //         if (result) {
        //             auth.logIn(result.data.login.token);
        //             if (isAdmin(result.data.login.user.role))
        //                 // and first time
        //                 window.location.assign('/onboarding');
        //             else {
        //                 // go to dashboard
        //                 window.location.assign('/home');
        //             }
        //         }
        //     } catch (error) {
        //         setSubmitting(false);
        //         showAllGraphQLErrors(error.graphQLErrors);
        //     }
        // }}
        >
            {({ values, isSubmitting, dirty, errors }) => (
                <Form className="subscription-form">
                    <Row gutter={[48, 16]} style={{ width: '80%' }}>
                        Coming sooon...
                    </Row>
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
