import React from 'react';
import { Row, Icon, Layout, Col } from 'antd';
import { Grid } from 'svg-loaders-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import InputField from '../../../form/components/InputField';
import Button from '../../../form/components/Button';
import { useSignup } from '../useMutations';
import { auth } from '../../auth';
import { showAllGraphQLErrors } from '../../../helper/graphqlErrors';
import { ROUTE_PATHS } from '../../../routes';
import Checkbox from '../../../form/components/Checkbox';

const initialValues = {
    email: '',
    password: '',
    fullName: '',
    role: 'ADMIN',
    termsAndConditions: false,
};

const signupSchema = Yup.object().shape({
    email: Yup.string().email('Please enter valid email').required('*Required'),
    password: Yup.string().required('*Required'),
    fullName: Yup.string().required('*Required'),
    termsAndConditions: Yup.boolean().oneOf([true]),
});

const Signup = ({ routerHistory, role }) => {
    const [signup] = useSignup();
    if (role) {
        initialValues.role = role;
    }
    return (
        <div className="login-wrapper">
            <Formik
                initialValues={initialValues}
                validationSchema={signupSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const result = await signup({
                            variables: {
                                fullName: values.fullName,
                                email: values.email,
                                password: values.password,
                            },
                        });
                        if (result) {
                            auth.setAccessToken(result.data.signup.token);
                            window.location.assign(ROUTE_PATHS.app.onboarding);
                        }
                    } catch (error) {
                        setSubmitting(false);
                        showAllGraphQLErrors(error.graphQLErrors);
                    }
                }}
            >
                {(props) => {
                    const { values, isSubmitting, dirty, errors } = props;
                    return (
                        <Form>
                            <Row className="auth-row">
                                <InputField name="email" type="text" label="Email" placeholder="" />
                            </Row>

                            <Row className="auth-row">
                                <InputField
                                    name="fullName"
                                    type="text"
                                    label="Full Name"
                                    placeholder=""
                                />
                            </Row>

                            <Row className="auth-row">
                                <InputField
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder=""
                                />
                            </Row>

                            <Row className="auth-row">
                                <Checkbox
                                    name="termsAndConditions"
                                    type="checkbox"
                                    label="I agree to the terms & conditions of Translatestack and would like to get product updates regulary."
                                />
                            </Row>

                            <Row>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    disabled={isSubmitting}
                                    className={classNames('wf-btn-primary', {
                                        active: dirty && Object.keys(errors).length === 0,
                                    })}
                                >
                                    {isSubmitting ? (
                                        <Grid style={{ width: '17px', height: '17px' }} />
                                    ) : (
                                        <>CREATE ACCOUNT</>
                                    )}
                                </Button>
                            </Row>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default Signup;
