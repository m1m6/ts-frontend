import React, { useState } from 'react';
import { Col, Divider, Row, Button } from 'antd';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { showAllGraphQLErrors } from '../../../helper/graphqlErrors';
import InputField from '../../../form/components/InputField';
import { useChangePasswordMutation } from '../useMutations';
import { auth } from '../../../signupLogin/auth';
import { useMeQueryClient } from '../../../rootUseQuery';
import Icon from '@ant-design/icons/lib/components/Icon';

const formItemLayout = {
    labelCol: { lg: 5, xs: 8, sm: 8 },
    wrapperCol: { lg: 8, xs: 12, sm: 12 }
};
const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8, offset: 2 }
};

const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
};

const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('*Required'),
    newPassword: Yup.string()
        .min(6, 'Password must be minimum 6 characters')
        .required('*Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

const ChangePassword = props => {
    const [changePassword] = useChangePasswordMutation();
    const { loading, error, data } = useMeQueryClient();

    return (
        <Col lg={16} md={16} sm={12}>
            <Divider orientation="left">Change Password</Divider>
            <Formik
                initialValues={initialValues}
                validationSchema={changePasswordSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const {
                            me: { email }
                        } = data;

                        console.log(values, email);
                        const result = await changePassword({
                            variables: {
                                email,
                                oldPassword: values.oldPassword,
                                newPassword: values.newPassword
                            }
                        });
                        if (result) {
                            auth.setAccessToken(result.data.changePassword.token);
                            window.location.assign('/');
                        }
                    } catch (error) {
                        setSubmitting(false);
                        showAllGraphQLErrors(error.graphQLErrors);
                    }
                }}
            >
                {({ values, isSubmitting }) => (
                    <Form>
                        <InputField
                            iconType="lock"
                            name="oldPassword"
                            type="password"
                            label="Password"
                            placeholder="***********"
                        />
                        <InputField
                            iconType="lock"
                            name="newPassword"
                            type="password"
                            label="New Password"
                            placeholder="***********"
                        />
                        <InputField
                            iconType="lock"
                            name="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            placeholder="***********"
                        />

                        <Button
                            htmlType="submit"
                            type="primary"
                            disabled={isSubmitting}
                            style={{
                                marginTop: '10px'
                            }}
                        >
                            {isSubmitting ? (
                                'SUBMITTING...'
                            ) : (
                                <>
                                    Submit
                                    <Icon type="arrow-right" />
                                </>
                            )}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Col>
    );
};

export default ChangePassword;
