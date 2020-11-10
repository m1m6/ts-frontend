import React from 'react';
import { Row, Icon } from 'antd';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';
import InputField from '../../../form/components/InputField';
import Button from '../../../form/components/Button';
import { showAllGraphQLErrors } from '../../../helper/graphqlErrors';

const initialValues = {
    email: '',
};

const resetPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Please enter valid email").required('*Required'),
});

const ResetPassword = ({ routerHistory }) => {
    // const [login] = useLogin();
    return (
        <div className="login-wrapper">
            <p
                style={{
                    fontFamily: 'Open Sans',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#9966ff',
                    cursor: 'pointer',
                    marginBottom: '21px',
                }}
                onClick={() => routerHistory.goBack()}
            >
                &lt; GO BACK
            </p>
            <Formik
                initialValues={initialValues}
                validationSchema={resetPasswordSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        // const result = await login({ variables: { ...values } });
                        // if (result) {
                        //     auth.logIn(result.data.login.token);
                        //     if (
                        //         isAdmin(result.data.login.user.role)
                        //     )
                        //         window.location.assign('/discover');
                        //     else {
                        //         window.location.assign('/discover');
                        //     }
                        // }
                    } catch (error) {
                        setSubmitting(false);
                        showAllGraphQLErrors(error.graphQLErrors);
                    }
                }}
            >
                {({ values, isSubmitting, dirty, errors }) => (
                    <Form>
                        <Row className="auth-row">
                            <InputField name="email" type="text" label="Email" />
                        </Row>
                        <Row>
                            <Button
                                htmlType="submit"
                                type="primary"
                                disabled={isSubmitting}
                                className={classNames('wf-btn-primary', {
                                    active: dirty && Object.keys(errors).length === 0,
                                })}
                                style={{ marginTop: '19px' }}
                            >
                                {isSubmitting ? 'SENDING...' : <>SEND EMAIL</>}
                            </Button>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ResetPassword;
