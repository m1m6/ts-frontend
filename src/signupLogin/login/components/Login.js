import React from 'react';
import { Row, Icon } from 'antd';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../../form/components/InputField';
import Button from '../../../form/components/Button';
import Link from '../../../form/components/Link';
import { useLogin } from '../useLogin';
import { showAllGraphQLErrors } from '../../../helper/graphqlErrors';
import { auth } from '../../auth';
import { isAdmin } from '../../utils';

const initialValues = {
    email: '',
    password: '',
};

const loginSchema = Yup.object().shape({
    email: Yup.string().required('*Required'),
    password: Yup.string().required('*Required'),
});

const Login = ({ routerHistory }) => {
    const [login] = useLogin();
    return (
        <div className="login-wrapper">
            <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const result = await login({ variables: { ...values } });
                        if (result) {
                            auth.logIn(result.data.login.token);
                            if (isAdmin(result.data.login.user.role))
                            // and first time
                                window.location.assign('/onboarding');
                            else {
                                // go to dashboard
                                window.location.assign('/home');
                            }
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
                            <InputField
                                name="email"
                                type="text"
                                label="Email"
                            />
                        </Row>
                        <Row className="auth-row">
                            <InputField
                                name="password"
                                type="password"
                                label="Password"
                            />
                        </Row>
                        <Row className="forgot-pwd-link">
                            <p>
                                <Link to="/reset-password" label="Forgot your password?" />
                            </p>
                        </Row>
                        <Row>
                            <Button
                                htmlType="submit"
                                type="primary"
                                disabled={isSubmitting}
                                className="wf-btn-primary"
                            >
                                {isSubmitting ? 'LOGGING IN...' : <>LOG IN</>}
                            </Button>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
