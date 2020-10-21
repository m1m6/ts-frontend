import React, { useState } from 'react';
import Select from 'react-select';
import { getLanguagesList } from '../../../assets/js/languages';
import Button from '../../../form/components/Button';
import Input from '../../../form/components/Input';
import Link from '../../../form/components/Link';

const OnboardinButton = ({ disabled = false, label }) => {
    return (
        <Button
            children={label}
            className="wf-btn-primary"
            disabled={disabled}
            style={{
                height: '45px',
                borderRadius: '4px',
                boxShadow: '0 2px 20px -5px #e8eaef',
                backgroundColor: '#a172ff',
            }}
        />
    );
};

const CustomStyle = (selectedValues) => {
    return {
        option: (base, data) => {
            return { ...base };
        },
        menu: (provided, state) => ({
            ...provided,
            width: state.selectProps.width,
            borderBottom: '1px dotted pink',
            color: state.selectProps.menuColor,
            padding: 20,
        }),
        container: (base, { selectProps: { width, height } }) => ({
            ...base,
            width: width,
            marginTop: '33px',
            minHeight: '83px',
            height: '83px',
        }),
        control: (base, state) => ({
            ...base,
            minHeight: '83px',
            border: 'solid 1px rgba(227, 232, 238, 0.42)',
            borderRadius: '2px',
        }),
        indicatorSeparator: (base, state) => ({
            ...base,
            display: 'none',
        }),
        multiValue: (base, state) => ({
            ...base,
            height: '47px',
            borderRadius: '3px',
            border: 'solid 1px rgba(227, 232, 238, 0.42)',
            backgroundColor: 'rgba(227, 232, 238, 0.42)',
            paddingLeft: '13px',
            paddingTop: '10px',
            paddingBottom: '8px',
        }),
    };
};

const Step1 = ({ currentStep }) => {
    let [values, setValues] = useState([]);

    const changeHandler = (value) => {
        setValues(value);
    };
    return (
        <div className="onboarding-step-wrapper">
            <div className="onboarding-step-count">{currentStep} out of 3</div>
            <div className="onboarding-step-title">Choose your target language</div>
            <div className="onboarding-step-description">
                Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                Journals und Research Paper stützt. Verwend
            </div>
            <div style={{ marginBottom: '26px' }}>
                <Select
                    styles={CustomStyle(values)}
                    options={getLanguagesList()}
                    isMulti={true}
                    value={values}
                    onChange={changeHandler}
                    width="517px"
                    placeholder="Select languages"
                />
            </div>
            <div>
                <OnboardinButton
                    disabled={values && values.length === 0}
                    onClick={() => {}}
                    label="NEXT"
                />
            </div>
        </div>
    );
};
const Step2 = ({ currentStep }) => {
    return (
        <div className="onboarding-step-wrapper">
            <div className="onboarding-step-count">{currentStep} out of 3</div>
            <div className="onboarding-step-title">Choose your domain</div>
            <div className="onboarding-step-description">
                Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                Journals und Research Paper stützt. Verwend
            </div>
            <div style={{ marginBottom: '26px', marginTop: '33px' }}>
                <Input placeholder="https://yourwebsite.com" />
            </div>
            <div>
                <OnboardinButton onClick={() => {}} label="ADD" />
            </div>
        </div>
    );
};

const Step3 = ({ currentStep }) => {
    return (
        <div className="onboarding-step-wrapper last">
            <div className="onboarding-step-count last">{currentStep} out of 3</div>
            <div className="onboarding-step-title last">Set up</div>
            <div className="onboarding-step-description last">
                Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                Journals und Research Paper stützt. Verwende dafür fundierte Quellen und Online
                Bibliotheken, die wir dir unten aufgeführt haben.
            </div>
            <div className="onboarding-step-code-wrapper">
                <div className="onboarding-step-code">
                    <Button children="COPY" />
                    <code>
                        <pre>{`
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
    line_items: [{
        price: 'price_1HKiSf2eZvKYlo2CxjF9qwbr',
        quantity: 1,
    }],
    mode: 'subscription',
    success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/cancel',
});
`}</pre>
                    </code>
                </div>
            </div>
            <div className="onboarding-step-title">Test your setup</div>
            <div className="onboarding-step-description last">
                Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                Journals und Research Paper stützt. Verwende dafür fundierte Quellen und Online
                Bibliotheken, die wir dir unten aufgeführt haben.
            </div>
            <div>
                <OnboardinButton onClick={() => {}} label="TEST SETUP" />
                <Link to="/reset-password" label="SKIP FOR NOW" />
            </div>
        </div>
    );
};
const Onboarding = () => {
    let currentStep = 3;

    if (currentStep === 1) {
        return <Step1 currentStep={currentStep} />;
    } else if (currentStep === 2) {
        return <Step2 currentStep={currentStep} />;
    } else {
        return <Step3 currentStep={currentStep} />;
    }
};

export default Onboarding;
