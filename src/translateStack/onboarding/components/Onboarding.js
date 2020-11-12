import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { message } from 'antd';
import { Grid } from 'svg-loaders-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import classNames from 'classnames';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguagesList, getUserLangaugesList } from '../../../assets/js/languages';
import Button from '../../../form/components/Button';
import Input from '../../../form/components/Input';
import Link from '../../../form/components/Link';
import { useOnboardingMutationClient } from '../useMutations';
import { useOnboardingQueryClient } from '../useQueries';
import { useOnboardingMutation, useUpdateUserMutation } from '../../../user/useMutations';
import { Redirect } from 'react-router-dom';
import { copyToClipboard } from '../../../utils/generalUtils';
import { useLanugagesListQuery, useMeQuery } from '../../../rootUseQuery';
import { useUpdateTargetLanguagesMutation } from '../../customizer/useMutations';

SyntaxHighlighter.registerLanguage('jsx', jsx);

const OnboardinButton = ({ disabled = false, label, isActive, ...props }) => {
    return (
        <Button
            children={label}
            className={classNames('wf-btn-primary', { active: isActive })}
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

const CustomStyle = () => {
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
        placeholder: (defaultStyles) => {
            return {
                ...defaultStyles,
                color: '#0a2540',
                marginLeft: '15px',
            };
        },
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
        singleValue: (base, state) => ({
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

const SourceLanguageStep = ({
    currentStep,
    onboardingMutation,
    setSourceLanguages,
    sourceLanguage,
    storedSourceLanguageId,
}) => {
    const [currentLang, setCurrent] = useState(null);

    const changeHandler = (value) => {
        setCurrent(value);
        setSourceLanguages(value);
    };

    const languagesList = getLanguagesList();
    const sourceLanguageExists = languagesList.filter((l) => l.value === storedSourceLanguageId);

    useEffect(() => {
        if (
            sourceLanguageExists &&
            sourceLanguageExists.length &&
            sourceLanguageExists[0] &&
            !currentLang
        ) {
            setCurrent(sourceLanguageExists);
            setSourceLanguages(sourceLanguageExists);
        }
    });

    return (
        <div className="onboarding-step-wrapper">
            <div className="onboarding-step-count">{currentStep} out of 4</div>
            <div className="onboarding-step-title">Choose your source and target languages</div>
            <div className="onboarding-step-description">
                Select the source language of your website.
            </div>
            <div style={{ marginBottom: '26px' }}>
                <Select
                    styles={CustomStyle(currentLang)}
                    options={languagesList}
                    isLoading={languagesList && languagesList.length == 0}
                    loadingMessage="Loading..."
                    isMulti={false}
                    value={currentLang}
                    onChange={changeHandler}
                    width="517px"
                    placeholder="Select source language"
                    isClearable={false}
                />
            </div>
            <div>
                <OnboardinButton
                    disabled={!sourceLanguage && !sourceLanguageExists}
                    isActive={!!sourceLanguage || sourceLanguageExists}
                    onClick={async () => {
                        await onboardingMutation({ variables: { currentStep: currentStep + 1 } });
                    }}
                    label="NEXT"
                />
            </div>
        </div>
    );
};

const TargetLanguagesStep = ({
    currentStep,
    onboardingMutation,
    selectedLanguages,
    setSelectedLanguages,
    sourceLanguage,
}) => {
    const languagesList = getLanguagesList();
    const userLanguages = getUserLangaugesList();
    const [currentSelected, setCurrentSelected] = useState(null);

    const changeHandler = (value) => {
        if (value === null) {
            value = [];
        }
        setCurrentSelected(value);
        setSelectedLanguages(value);
    };

    useEffect(() => {
        if (userLanguages && userLanguages.length && userLanguages[0] && !currentSelected) {
            setCurrentSelected(userLanguages);
            setSelectedLanguages(userLanguages);
        }
    });

    console.log('sourceLanguage', sourceLanguage);

    return (
        <div className="onboarding-step-wrapper">
            <div className="onboarding-step-count">{currentStep} out of 4</div>
            <div className="onboarding-step-title">Choose your source and target languages</div>
            <div className="onboarding-step-description">
                Select the languages that your website should be translated to. You can always add
                languages later, too.
            </div>
            <div style={{ marginBottom: '26px' }}>
                <Select
                    styles={CustomStyle(selectedLanguages)}
                    options={
                        languagesList.filter(
                            (lang) =>
                                lang.value !==
                                (sourceLanguage && sourceLanguage.length
                                    ? sourceLanguage[0].value
                                    : sourceLanguage.value)
                        )
                        // .filter((l) => !userLanguagesIds.includes(l.value))}
                    }
                    isLoading={languagesList && languagesList.length == 0}
                    // loadingMessage="Loading..."
                    isMulti={true}
                    value={currentSelected}
                    onChange={changeHandler}
                    width="517px"
                    placeholder="Select target languages"
                    isDisabled={languagesList && languagesList.length == 0}
                />
            </div>
            <div>
                <OnboardinButton
                    isActive={selectedLanguages && selectedLanguages.length > 0}
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
            <div className="onboarding-step-count">{currentStep} out of 4</div>
            <div className="onboarding-step-title">Enter your domain</div>
            <div className="onboarding-step-description">
                Enter the URL of your project and get started translating your page within minutes.
                Make sure it is a valid URL.
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
                    isActive={!!pageUrl}
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
    routerHistory,
    apiKey,
    sourceLanguage,
}) => {
    const [onboarding] = useOnboardingMutation();
    const [updateUser] = useUpdateUserMutation();
    const [updateTargetLanguages] = useUpdateTargetLanguagesMutation();

    return (
        <div className="onboarding-step-wrapper last">
            <div className="onboarding-step-count last">{currentStep} out of 4</div>
            <div className="onboarding-step-title last">Final Set up</div>
            <div className="onboarding-step-description last">
                This is your unique code snippet. Copy & paste it and place in in the head of your
                project. Only after this step you are able to get started.
            </div>
            <div className="onboarding-step-code-wrapper">
                <div className="onboarding-step-code">
                    <Button children="COPY" onClick={(e) => copyToClipboard('code-snippet')} />
                    <SyntaxHighlighter language="javascript" style={dark} id="code-snippet">
                        {`
    <script type="text/javascript">
        var tsstack = function () {
            var tss = document.createElement('script'); tss.type = 'text/javascript'; tss.async = true;
            tss.src = 'https://app.translatestack.com/sdk/sdk.js?apiKey=${apiKey}';
            tss.id = "tss-script";
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(tss);
        }
        window.onload = tsstack
    </script>`}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="onboarding-step-title">Test your setup</div>
            <div className="onboarding-step-description last">
                Let's validate if the code snippet is placed correctly in the head of your project.
                You are one click away to start translating.
            </div>
            <div>
                <OnboardinButton
                    isActive={true}
                    onClick={async () => {
                        setIsValidating(true);

                        if (
                            selectedLanguages &&
                            selectedLanguages.length &&
                            sourceLanguage &&
                            sourceLanguage.length &&
                            sourceLanguage[0] &&
                            pageUrl
                        ) {
                            const results = await onboarding({
                                variables: {
                                    pageUrl,
                                    translationLanguages: selectedLanguages.map(
                                        (lang) => lang.value
                                    ),
                                    sourceLanguage:
                                        sourceLanguage && sourceLanguage.length && sourceLanguage[0]
                                            ? sourceLanguage[0].value
                                            : 0,
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
                        } else {
                            message.warn('Please fill all onboarding fields');
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
                        let selectedLanguagesIds = selectedLanguages.map((l) => l.value);

                        console.log('selectedLanguagesIds', selectedLanguagesIds);
                        console.log('sourceLanguage', sourceLanguage);

                        if (selectedLanguagesIds) {
                            updateTargetLanguages({
                                variables: {
                                    selectedLanguagesIds,
                                },
                            });
                        }

                        if (sourceLanguage && sourceLanguage.length && sourceLanguage[0]) {
                            updateUser({
                                variables: { sourceLanguage: sourceLanguage[0].value },
                            });
                        }

                        await updateUser({
                            variables: { skippedOnboarding: true },
                        });

                        routerHistory.push('/');
                    }}
                />
            </div>
        </div>
    );
};
const Onboarding = ({ isNew, routerHistory }) => {
    let [sourceLanguage, setSourceLanguages] = useState(undefined);
    let [selectedLanguages, setSelectedLanguages] = useState([]);
    let [pageUrl, setPageUrl] = useState(undefined);
    let [isValidating, setIsValidating] = useState(undefined);
    let [hasError, setHasError] = useState(undefined);

    const { data: meData, loading: meLoading } = useMeQuery();
    const { loading, data, error } = useOnboardingQueryClient();
    let [onboardingMutation] = useOnboardingMutationClient();

    useEffect(() => {
        /*

        React.useEffect(() => {
    return () => {
            props.history.goForward();
        }
    }
}, []);
        */
        if (routerHistory.location.pathname === '/onboarding') {
            window.history.pushState(null, document.title, window.location.href);
            window.addEventListener('popstate', function (event) {
                window.history.pushState(null, document.title, window.location.href);
            });
        }
    });

    if (!isNew) {
        return <Redirect to="/" />;
    }

    if (loading || meLoading) {
        return '';
    }

    let currentStep = data && data.onboarding ? data.onboarding.currentStep : 1;
    let apiKey = meData && meData.me ? meData.me.apiKey : '';
    let storedSourceLanguageId = meData && meData.me ? meData.me.sourceLanguage : '';

    if (currentStep === 1) {
        return (
            <SourceLanguageStep
                currentStep={currentStep}
                onboardingMutation={onboardingMutation}
                sourceLanguage={sourceLanguage}
                setSourceLanguages={setSourceLanguages}
                storedSourceLanguageId={storedSourceLanguageId}
            />
        );
    }
    if (currentStep === 2) {
        return (
            <TargetLanguagesStep
                currentStep={currentStep}
                onboardingMutation={onboardingMutation}
                selectedLanguages={selectedLanguages}
                setSelectedLanguages={setSelectedLanguages}
                sourceLanguage={sourceLanguage}
            />
        );
    } else if (currentStep === 3) {
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
                routerHistory={routerHistory}
                apiKey={apiKey}
                sourceLanguage={sourceLanguage}
            />
        );
    }
};

export default Onboarding;
