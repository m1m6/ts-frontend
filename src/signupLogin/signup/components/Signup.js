import React from 'react';
import { Row, Icon, Layout, Col } from 'antd';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
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
    email: Yup.string().required('*Required'),
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
                            window.location.assign(ROUTE_PATHS.app.onboarding)
                        }
                    } catch (error) {
                        setSubmitting(false);
                        showAllGraphQLErrors(error.graphQLErrors);
                    }
                }}
            >
                {({ values, isSubmitting }) => (
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
                                label="Ich möchte keine E-Mails zu Produktaktualisierungen erhalten. Sofern Sie dieses Feld nicht markieren, erhalten Sie gelegentlich hilfreiche und für Sie relevante E-Mails von Stripe. Sie können sich jedoch jederzeit abmelden. Privacy Policy."
                            />
                        </Row>

                        <Row>
                            <Button
                                htmlType="submit"
                                type="primary"
                                disabled={isSubmitting}
                                className="wf-btn-primary"
                            >
                                {isSubmitting ? 'SIGNING UP...' : <>CREATE ACCOUNT</>}
                            </Button>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Signup;
