import React, { useState } from 'react';
import Select from 'react-select';
import { message } from 'antd';
import { Grid } from 'svg-loaders-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguagesList } from '../../../assets/js/languages';
import Button from '../../../form/components/Button';
import Input from '../../../form/components/Input';
import Link from '../../../form/components/Link';
import { useOnboardingMutationClient } from '../useMutations';
import { useOnboardingQueryClient } from '../useQueries';
import { useOnboardingMutation, useUpdateUserMutation } from '../../../user/useMutations';
import { Redirect } from 'react-router-dom';

SyntaxHighlighter.registerLanguage('jsx', jsx);

const OnboardinButton = ({ disabled = false, label, ...props }) => {
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
            {...props}
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

const Step1 = ({ currentStep, onboardingMutation, selectedLanguages, setSelectedLanguages }) => {
    const changeHandler = (value) => {
        console.log('changeHandler', value);
        setSelectedLanguages(value);
    };

    const languagesList = getLanguagesList();
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
                    styles={CustomStyle(selectedLanguages)}
                    options={languagesList}
                    isLoading={languagesList && languagesList.length == 0}
                    loadingMessage="Loading..."
                    isMulti={true}
                    value={selectedLanguages}
                    onChange={changeHandler}
                    width="517px"
                    placeholder="Select languages"
                    isClearable={true}
                />
            </div>
            <div>
                <OnboardinButton
                    disabled={
                        selectedLanguages == null ||
                        (selectedLanguages && selectedLanguages.length === 0)
                    }
                    onClick={async () => {
                        await onboardingMutation({ variables: { currentStep: currentStep + 1 } });
                    }}
                    label="NEXT"
                />
            </div>
        </div>
    );
};
const Step2 = ({ currentStep, onboardingMutation, pageUrl, setPageUrl }) => {
    return (
        <div className="onboarding-step-wrapper">
            <div className="onboarding-step-count">{currentStep} out of 3</div>
            <div className="onboarding-step-title">Choose your domain</div>
            <div className="onboarding-step-description">
                Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                Journals und Research Paper stützt. Verwend
            </div>
            <div style={{ marginBottom: '26px', marginTop: '33px' }}>
                <Input
                    placeholder="https://yourwebsite.com"
                    value={pageUrl}
                    onChange={(e) => {
                        setPageUrl(e.target.value);
                    }}
                />
            </div>
            <div>
                <OnboardinButton
                    disabled={!pageUrl}
                    onClick={async () => {
                        if (/^(http|https):\/\/[^ "]+$/.test(pageUrl)) {
                            await onboardingMutation({
                                variables: { currentStep: currentStep + 1 },
                            });
                        } else {
                            message.error('Please enter a valie static page url');
                        }
                    }}
                    label="ADD"
                />
            </div>
        </div>
    );
};

const Step3 = ({
    currentStep,
    onboardingMutation,
    pageUrl,
    isValidating,
    setIsValidating,
    selectedLanguages,
    hasError,
    setHasError,
}) => {
    const [onboarding] = useOnboardingMutation();
    const [updateUser] = useUpdateUserMutation();
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
                    <SyntaxHighlighter language="javascript" style={dark}>
                        {`
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
    });`}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="onboarding-step-title">Test your setup</div>
            <div className="onboarding-step-description last">
                Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                Journals und Research Paper stützt. Verwende dafür fundierte Quellen und Online
                Bibliotheken, die wir dir unten aufgeführt haben.
            </div>
            <div>
                <OnboardinButton
                    onClick={async () => {
                        setIsValidating(true);
                        const results = await onboarding({
                            variables: {
                                pageUrl,
                                translationLanguages: selectedLanguages.map((lang) => lang.value),
                            },
                        });

                        if (results && results.data && results.data.onboarding) {
                            message.success('Successfully added your page!');
                            await updateUser({ variables: { isNew: false } });
                            window.location.assign('/');
                        } else {
                            setHasError(true);
                            message.error(
                                'Ooops, it seems the snippet is still not installed. Try again.'
                            );
                        }
                        setIsValidating(false);
                    }}
                    label={
                        isValidating ? (
                            <Grid style={{ width: '17px', height: '17px' }} />
                        ) : hasError ? (
                            'TEST AGAIN'
                        ) : (
                            'TEST SETUP'
                        )
                    }
                    disabled={isValidating}
                />
                <Link
                    label="SKIP FOR NOW"
                    onClick={async (e) => {
                        await updateUser({ variables: { isNew: false } });
                        window.location.assign('/');
                    }}
                />
            </div>
        </div>
    );
};
const Onboarding = ({ isNew }) => {
    let [selectedLanguages, setSelectedLanguages] = useState([]);
    let [pageUrl, setPageUrl] = useState(undefined);
    let [isValidating, setIsValidating] = useState(undefined);
    let [hasError, setHasError] = useState(undefined);

    const { loading, data, error } = useOnboardingQueryClient();
    let [onboardingMutation] = useOnboardingMutationClient();

    if (!isNew) {
        return <Redirect to="/" />;
    }
    if (loading) {
        return 'loading...';
    }

    let currentStep = data && data.onboarding ? data.onboarding.currentStep : 1;

    console.log('Values', selectedLanguages, pageUrl);
    if (currentStep === 1) {
        return (
            <Step1
                currentStep={currentStep}
                onboardingMutation={onboardingMutation}
                selectedLanguages={selectedLanguages}
                setSelectedLanguages={setSelectedLanguages}
            />
        );
    } else if (currentStep === 2) {
        return (
            <Step2
                currentStep={currentStep}
                onboardingMutation={onboardingMutation}
                pageUrl={pageUrl}
                setPageUrl={setPageUrl}
            />
        );
    } else {
        return (
            <Step3
                currentStep={currentStep}
                onboardingMutation={onboardingMutation}
                pageUrl={pageUrl}
                selectedLanguages={selectedLanguages}
                isValidating={isValidating}
                setIsValidating={setIsValidating}
                selectedLanguages={selectedLanguages}
                hasError={hasError}
                setHasError={setHasError}
            />
        );
    }
};

export default Onboarding;
