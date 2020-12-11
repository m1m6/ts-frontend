import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select/';
import * as Yup from 'yup';
import { Grid } from 'svg-loaders-react';
import { message } from 'antd';
import classNames from 'classnames';
import Button from '../../../form/components/Button';
import { Formik, Form } from 'formik';
import InputField from '../../../form/components/InputField';
import { useInviteUserMutation } from '../useMutations';
import { showAllGraphQLErrors } from '../../../helper/graphqlErrors';

const InputCustomStyle = {
    width: '100%',
    height: '65px',
};

const inviteSchema = Yup.object().shape({
    email: Yup.string().email('Please enter valid email').required('*Required'),
    fullName: Yup.string().required('*Required'),
});

const InviteUser = ({ close }) => {
    const plansOptions = [
        { label: 'ADMIN', value: 'ADMIN' },
        { label: 'EDITOR', value: 'EDITOR' },
        { label: 'DEVELOPER', value: 'DEVELOPER' },
    ];

    const initialValues = {
        role: plansOptions[0],
        fullName: '',
        email: '',
    };

    const [inviteUser] = useInviteUserMutation();

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={inviteSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    console.log('values', values);
                    const result = await inviteUser({
                        variables: { ...values, role: values.role.value },
                    });
                    if (result && result.data && result.data.inviteUser) {
                        message.success(
                            'User invited successfully, an email sent to him with his credentials.'
                        );
                        close(false);
                    } else {
                        message.success('Unable to invite user');
                    }
                } catch (error) {
                    setSubmitting(false);
                    showAllGraphQLErrors(error.graphQLErrors);
                }
            }}
        >
            {({ values, isSubmitting, dirty, errors, setFieldValue, setFieldTouched }) => (
                <Form className="invite-form">
                    <div className="invite-popup">
                        <>
                            <div className="popup-title">
                                Add new members to
                                <br /> your team{' '}
                            </div>
                            <div className="invite-user-form">
                                <div style={{ marginBottom: '30px' }}>
                                    <div className="field-name">ROLE</div>
                                    <Select
                                        styles={CustomStyle()}
                                        // isLoading={loading}
                                        options={plansOptions}
                                        defaultValue={plansOptions[0]}
                                        // value={values.role}
                                        onChange={(e) => {
                                            console.log(e);
                                            setFieldValue('role', e);
                                        }}
                                        onBlur={setFieldTouched}
                                        width="100%"
                                        isClearable={false}
                                        isSearchable={false}
                                    />
                                </div>
                                <div style={{ marginBottom: '30px' }}>
                                    <div className="field-name">FULL NAME</div>
                                    <InputField
                                        name="fullName"
                                        type="text"
                                        style={InputCustomStyle}
                                        shouldShowError={false}
                                    />
                                </div>

                                <div>
                                    <div className="field-name">EMAIL</div>
                                    <InputField
                                        name="email"
                                        type="text"
                                        style={InputCustomStyle}
                                        shouldShowError={false}
                                    />
                                </div>
                            </div>
                            <div className="popup-next-btn">
                                {/* <Button
                                    children="ADD"
                                    className="wf-btn-primary"
                                    onClick={() => {}}
                                /> */}

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
                                        <>ADD</>
                                    )}
                                </Button>
                            </div>
                        </>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

const CustomStyle = (isFirst) => {
    return {
        option: (base, data) => {
            return {
                ...base,
                backgroundColor: '#fff',
                color: '#0a2540',
                fontSize: '14px',
                '&:active': { backgroundColor: 'rgba(227, 232, 238, 0.01)' },
                '&:hover': { backgroundColor: '#e8eaef' },
            };
        },
        menu: (provided, state) => ({
            ...provided,
            width: state.selectProps.width,
        }),
        container: (base, { selectProps: { width, height } }) => ({
            ...base,
            marginTop: '13px',
            height: isFirst ? '100%' : height,
        }),
        control: (base, state) => ({
            ...base,
            border: 'solid 1px rgba(227, 232, 238, 0.42)',
            borderRadius: '2px',
            boxShadow: 'none',
            '&:hover': { borderColor: 'none' },
            height: '65px',
        }),
        singleValue: (base, { selectProps: { width, height } }) => ({
            ...base,
            width: '100%',
            fontFamily: 'Open Sans',
            fontSize: '14px',
            color: '#0a2540',
        }),
        indicatorSeparator: (base, state) => ({
            ...base,
            display: 'none',
        }),
        valueContainer: (base, { selectProps: { width, height } }) => ({
            ...base,
            height: !isFirst ? '100%' : height,
        }),
    };
};

export default InviteUser;
