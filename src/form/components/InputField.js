import React from 'react';
import { useField, Field } from 'formik';
import { Input } from 'antd';
import classNames from 'classnames';
import Icon from '@ant-design/icons/lib/components/Icon';

const InputField = ({ label, iconType, shouldShowError=true, ...props }) => {
    const [field, meta, helpers] = useField(props);
    return (
        <div className="input-field-wrapper">
            <div className="form-label">{label}</div>
            {meta.touched && meta.error && shouldShowError && (
                <span className="error-message">{meta.error}</span>
            )}
            <Input
                size="large"
                {...field}
                {...props}
                prefix={<Icon type={iconType} />}
                className={classNames({ required: meta.touched && meta.error })}
                autoComplete="chrome-off"
            />
        </div>
    );
};

export default InputField;
