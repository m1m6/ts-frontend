import React from 'react';
import { useField, Field } from 'formik';
import classNames from 'classnames';

const Checkbox = ({ label, iconType, ...props }) => {
    const [field, meta, helpers] = useField(props);
    return (
        <div className="checkbox-field-wrapper">
            <div className="checkbox-input">
                <input
                    type="checkbox"
                    {...field}
                    {...props}
                    className={classNames({ required: meta.touched && meta.error })}
                />
            </div>
            <div className="form-label">{label}</div>
        </div>
    );
};

export default Checkbox;
