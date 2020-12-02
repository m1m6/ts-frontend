import React, { useState } from 'react';
import { message, Radio } from 'antd';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { browserHistory } from '../browserHistory';
import GoBack from '../components/GoBack';
import { ReactComponent as RightArrow } from '../assets/right-arrow-angle.svg';
import {
    useCustomizerMutation,
    useCustomizerMutationClient,
    useUpdateTargetLanguagesMutation,
} from '../translateStack/customizer/useMutations';
import {
    useCustomizerQueryClient,
    useCustomizerQueryServer,
} from '../translateStack/customizer/useQueries';
import Button from '../form/components/Button';
import { useLanugagesListQuery, useMeQuery } from '../rootUseQuery';
import { mapLanguages } from '../translateStack/translation/utils';
import Select from 'react-select';
import Input from '../form/components/Input';
import { useUserLanguagesQuery } from '../user/useQueries';
import { useSetUpgradeDataClient } from '../upgrade/useMutation';

const MainComponent = ({ setWhichInnerSidebar }) => {
    const [updateCustomizerClient] = useCustomizerMutationClient();

    return (
        <>
            <div className="customizer-menu-title">Your settings and preferences</div>
            <div className="customizer-menu-item">
                <Link
                    to="#"
                    title="Projects"
                    onClick={async (e) => {
                        setWhichInnerSidebar(1);
                        await updateCustomizerClient({
                            variables: { shouldOpenTheSelectOptions: false },
                        });
                    }}
                >
                    Position
                    <RightArrow className="right-arrow" />
                </Link>
            </div>
            <div className="customizer-menu-item">
                <Link
                    to="#"
                    title="Projects"
                    onClick={async (e) => {
                        setWhichInnerSidebar(2);
                        await updateCustomizerClient({
                            variables: { shouldOpenTheSelectOptions: true },
                        });
                    }}
                >
                    Languages
                    <RightArrow className="right-arrow" />
                </Link>
            </div>
            <div className="customizer-menu-item">
                <Link
                    to="#"
                    title="Projects"
                    onClick={async (e) => {
                        setWhichInnerSidebar(3);
                        await updateCustomizerClient({
                            variables: { shouldOpenTheSelectOptions: true },
                        });
                    }}
                >
                    Appearance
                    <RightArrow className="right-arrow" />
                </Link>
            </div>
            <div className="customizer-menu-item">
                <Link
                    to="#"
                    title="Projects"
                    onClick={async (e) => {
                        setWhichInnerSidebar(4);
                        await updateCustomizerClient({
                            variables: { shouldOpenTheSelectOptions: false },
                        });
                    }}
                >
                    Text
                    <RightArrow className="right-arrow" />
                </Link>
            </div>
        </>
    );
};

const sharedBtnStyles = {
    marginLeft: '40px',
    // bottom: '38px',
    // position: 'absolute',
    marginBottom: '100px',
    width: '105px',
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
            padding: 6,
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

const CustomDirectionStyle = () => {
    return {
        option: (base, data) => {
            return {
                ...base,
                backgroundColor: '#fff',
                color: '#0a2540',
                fontSize: '12px',
                letterSpacing: '0.43px',
                fontWeight: 'bold',
                '&:active': { backgroundColor: 'rgba(227, 232, 238, 0.00)' },
                '&:hover': { backgroundColor: '#e8eaef' },
            };
        },
        menu: (provided, state) => ({
            ...provided,
            width: state.selectProps.width,
            borderBottom: '1px dotted pink',
            color: state.selectProps.menuColor,
        }),
        container: (base, { selectProps: { width, height } }) => ({
            ...base,
            width: width,
            marginTop: '10px',
            height: '30px',
        }),
        control: (base, state) => ({
            ...base,
            border: 'solid 1px rgba(227, 232, 238, 0.42)',
            borderRadius: '2px',
            boxShadow: 'none',
            '&:hover': { borderColor: '#a172ff' },
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
        singleValue: (base, state) => ({
            ...base,
            fontFamily: 'Open Sans',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            color: '#0a2540',
        }),
    };
};

const PositionComponent = ({ bannerVisible, setPrevPosition }) => {
    const [btnActive, setBtnActive] = useState(false);
    const [userPosition, setUserPosition] = useState(null);
    const [customPosition, setCustomPosition] = useState(null);
    const [customDirection, setCustomDirection] = useState(null);
    // const [prevPosition, setPrevPosition] = useState(null);

    // const { data, loading: meLoading } = useMeQuery();
    const { data: customizerData, loading: customizerLoading } = useCustomizerQueryServer();
    const [updateCustomizer] = useCustomizerMutation();
    const [updateCustomizerClient] = useCustomizerMutationClient();

    if (customizerLoading) return <></>;

    let customizer = customizerData.getUserCustomizer; //data && data.me ? data.me.customizer : {};

    if (customizer && userPosition === null) {
        setUserPosition(customizer.position || 'RIGHT');
    }

    if (customizer && customPosition === null) {
        setCustomPosition(customizer.customDivId || '');
    }

    if (customizer && customizer.customDivDirection !== null && customDirection === null) {
        setCustomDirection({
            label: `${customizer.customDivDirection[0]}${customizer.customDivDirection
                .slice(1)
                .toLowerCase()}`,
            value: customizer.customDivDirection,
        });
    }

    return (
        <>
            <div className="customizer-menu-title">Position</div>
            <div className="customizer-menu-sub-title">
                Choose the position of the switcher below
            </div>

            <div className="customizer-menu-group">
                <Radio.Group
                    value={userPosition}
                    onChange={async (e) => {
                        setPrevPosition(userPosition);
                        setUserPosition(e.target.value);

                        if (e.target.value !== 'CUSTOM') {
                            setBtnActive(true);
                        }
                        await updateCustomizerClient({
                            variables: {
                                position: e.target.value,
                            },
                        });
                    }}
                >
                    <Radio.Button value="RIGHT">RIGHT</Radio.Button>
                    <Radio.Button value="LEFT">LEFT</Radio.Button>
                    <Radio.Button value="CUSTOM">CUSTOM</Radio.Button>
                </Radio.Group>
                {userPosition === 'CUSTOM' && (
                    <div className="custom-position-input">
                        <Input
                            placeholder="container"
                            value={customPosition}
                            onChange={(e) => {
                                setCustomPosition(e.target.value);
                                if (e.target.value !== '') {
                                    setBtnActive(true);
                                }
                            }}
                        />

                        <div className="hint">
                            * If id of element will not be found on the page, default position will
                            be used
                        </div>

                        <div
                            style={{
                                fontFamily: 'Open Sans',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                letterSpacing: '0.5px',
                                color: '#0a2540',
                                marginTop: '19px',
                                marginBottom: '10px',
                            }}
                        >
                            Direction of Opening
                        </div>
                        <Select
                            options={[
                                { label: 'Down', value: 'DOWN' },
                                { label: 'Up', value: 'UP' },
                            ]}
                            styles={CustomDirectionStyle()}
                            value={customDirection}
                            onChange={async (e) => {
                                setCustomDirection(e);
                                setBtnActive(true);
                                await updateCustomizerClient({
                                    variables: {
                                        customDirection: e.label,
                                    },
                                });
                            }}
                            width="100%"
                            height="30px"
                        />
                    </div>
                )}

                {btnActive && (
                    <Button
                        children="SAVE"
                        className={classNames('wf-btn-primary active', { active: btnActive })}
                        onClick={async (e) => {
                            setPrevPosition(userPosition);

                            if (userPosition === 'CUSTOM' && !customPosition) {
                                message.error('Please enter valid DIV ID.');
                                return;
                            }

                            setBtnActive(false);

                            const results = await updateCustomizer({
                                variables: {
                                    ...customizer,
                                    position: userPosition,
                                    customDivId: customPosition,
                                    customDivDirection: customDirection
                                        ? customDirection.value
                                        : '',
                                },
                            });

                            if (results.data && results.data.updateCustomizer) {
                                message.success('Successfully saved.');
                            }

                            setBtnActive(false);
                        }}
                        style={{
                            ...sharedBtnStyles,
                            // bottom: bannerVisible ? '88px ' : '38px ',
                        }}
                    />
                )}
            </div>
        </>
    );
};

const TextComponent = ({ setPrevText }) => {
    // const { data, loading: meLoading } = useMeQuery();
    const [updateCustomizer] = useCustomizerMutation();
    const [updateCustomizerClient] = useCustomizerMutationClient();
    const { data: customizerData, loading: customizerLoading } = useCustomizerQueryServer();

    const [userText, setUserText] = useState(null);
    const [btnActive, setBtnActive] = useState(false);

    if (customizerLoading) return <>Loading...</>;

    let customizer = customizerData.getUserCustomizer;

    if (customizer && userText === null) {
        setUserText(customizer.text || 'FULL');
    }

    return (
        <>
            <div className="customizer-menu-title">Text</div>
            <div className="customizer-menu-sub-title">
                Choose the position of the switcher below
            </div>

            <div className="customizer-menu-group">
                <Radio.Group
                    value={userText}
                    onChange={async (e) => {
                        setPrevText(userText);
                        setUserText(e.target.value);
                        setBtnActive(true);
                        await updateCustomizerClient({
                            variables: {
                                text: e.target.value,
                            },
                        });
                    }}
                >
                    <Radio.Button value="FULL">FULL</Radio.Button>
                    <Radio.Button value="SHORTENED">SHORTENED</Radio.Button>
                    <Radio.Button value="TEXT_ONLY">TEXT ONLY</Radio.Button>
                    <Radio.Button value="FLAG_ONLY">FLAG ONLY</Radio.Button>
                </Radio.Group>
                {btnActive && (
                    <Button
                        children="SAVE"
                        className={classNames('wf-btn-primary active')}
                        onClick={async (e) => {
                            setPrevText(userText);

                            setBtnActive(false);

                            const results = await updateCustomizer({
                                variables: {
                                    ...customizer,
                                    text: userText,
                                },
                            });

                            if (results.data && results.data.updateCustomizer) {
                                message.success('Successfully saved.');
                            }
                        }}
                        style={{ ...sharedBtnStyles }}
                    />
                )}
            </div>
        </>
    );
};

const LanguagesComponent = ({ setLanguagesSaved }) => {
    const [selectedLanguages, setSelectedLanguages] = useState(null);
    const [isInitialValues, setIsInitialValues] = useState(true);

    const [btnActive, setBtnActive] = useState(false);
    const { data: langData, loading: langLoading } = useLanugagesListQuery();
    const {
        data: customizerLocalData,
        lodaing: customizerLocalLoading,
    } = useCustomizerQueryClient();

    const [updateCustomizerClient] = useCustomizerMutationClient();

    const { data: meData, loading: meLoading } = useMeQuery();
    const { data: userLanguagesData, loading: userLanguagesLoading } = useUserLanguagesQuery();
    const [updateCustomizer] = useCustomizerMutation();
    const [updateTargetLanguages] = useUpdateTargetLanguagesMutation();
    const { data: customizerData, loading: customizerLoading } = useCustomizerQueryServer();
    const [updateUpgradeData] = useSetUpgradeDataClient();

    if (
        meLoading ||
        langLoading ||
        customizerLocalLoading ||
        userLanguagesLoading ||
        customizerLoading
    )
        return <>Loading...</>;

    let userLanguages =
        userLanguagesData && userLanguagesData.userLanguages ? userLanguagesData.userLanguages : [];
    let sourceLanguage = meData.me.sourceLanguage;

    let systemLanguages = langData.languagesList.filter((l) => l.id != sourceLanguage);

    let mappedLangs = mapLanguages(systemLanguages);
    let customizer = customizerData.getUserCustomizer;

    if (customizer && selectedLanguages === null && isInitialValues) {
        let selectedTargetLangs = mapLanguages(userLanguages.filter(({ isActive }) => isActive));
        setSelectedLanguages(selectedTargetLangs);
    }

    const changeHandler = async (value, action) => {
        setLanguagesSaved(false);
        setSelectedLanguages(value);
        setBtnActive(true);
        setIsInitialValues(false);

        let mappedValues = value ? value.map((v) => v.value) : [];
        let removedItems = JSON.parse(JSON.stringify(customizerLocalData.customizer.removedItems));

        if (action.action === 'remove-value') {
            removedItems.push(action.removedValue.value);
        }

        removedItems = removedItems.filter((i) => !mappedValues.includes(i));
        await updateCustomizerClient({
            variables: {
                languages: mappedValues,
                removedItems: removedItems,
            },
        });
    };

    return (
        <>
            <div className="customizer-menu-title">Languages</div>
            <div className="customizer-menu-sub-title">Choose your target languages below </div>

            <div className="customizer-menu-group">
                <div
                    style={{
                        marginBottom: `${
                            selectedLanguages && selectedLanguages.length
                                ? selectedLanguages.length * 50
                                : 50
                        }px `,
                    }}
                >
                    <Select
                        styles={CustomStyle()}
                        options={mappedLangs}
                        isLoading={mappedLangs && mappedLangs.length == 0}
                        isMulti={true}
                        value={selectedLanguages}
                        onChange={changeHandler}
                        menuShouldScrollIntoView
                        width="200px"
                        placeholder="Select languages"
                        isClearable={false}
                    />
                </div>
                {btnActive && (
                    <Button
                        children="SAVE"
                        className={classNames('wf-btn-primary active')}
                        onClick={async (e) => {
                            setLanguagesSaved(true);
                            setBtnActive(false);
                            let selectedLanguagesIds = selectedLanguages
                                ? selectedLanguages.map((l) => l.value)
                                : [];

                            const results = await updateTargetLanguages({
                                variables: {
                                    selectedLanguagesIds,
                                },
                            });

                            if (results.data && results.data.updateTargetLanguages) {
                                message.success('Successfully saved.');
                                await updateUpgradeData({
                                    variables: {
                                        shouldShowUpgradePopup: true,
                                    },
                                });
                            } else {
                                message.warn(
                                    'An error occured during saving your changes, please try again later.'
                                );
                            }
                        }}
                        style={{ ...sharedBtnStyles }}
                    />
                )}
            </div>
        </>
    );
};

const AppearanceComponent = ({ setPrevAppearance }) => {
    const [updateCustomizer] = useCustomizerMutation();
    const [updateCustomizerClient] = useCustomizerMutationClient();
    const [updateUpgradeData] = useSetUpgradeDataClient();

    const { data: customizerData, loading: customizerLoading } = useCustomizerQueryServer();

    const [btnActive, setBtnActive] = useState(false);

    const [userBranding, setUserBranding] = useState(null);

    if (customizerLoading) return <></>;

    let customizer = customizerData.getUserCustomizer;

    if (customizer && userBranding === null) {
        setUserBranding(customizer.appearance || 'WITH_BRANDING');
    }

    return (
        <>
            <div className="customizer-menu-title">Branding</div>
            <div className="customizer-menu-sub-title">
                Choose the position of the switcher below
            </div>

            <div className="customizer-menu-group">
                <Radio.Group
                    value={userBranding}
                    onChange={async (e) => {
                        setPrevAppearance(userBranding);
                        setUserBranding(e.target.value);
                        setBtnActive(true);
                        await updateCustomizerClient({
                            variables: {
                                branding: e.target.value,
                            },
                        });
                    }}
                >
                    <Radio.Button value="WITH_BRANDING">WITH BRANDING</Radio.Button>
                    <Radio.Button value="WITHOUT_BRANDING">WITHOUT BRANDING</Radio.Button>
                </Radio.Group>
                {btnActive && (
                    <Button
                        children="SAVE"
                        className={classNames('wf-btn-primary active')}
                        onClick={async (e) => {
                            setPrevAppearance(userBranding);
                            setBtnActive(false);
                            const results = await updateCustomizer({
                                variables: {
                                    ...customizer,
                                    appearance: userBranding,
                                },
                            });

                            if (results.data && results.data.updateCustomizer) {
                                message.success('Successfully saved.');

                                if (userBranding === 'WITHOUT_BRANDING') {
                                    await updateUpgradeData({
                                        variables: {
                                            shouldShowUpgradePopup: true,
                                        },
                                    });
                                }
                            }
                        }}
                        style={{ ...sharedBtnStyles }}
                    />
                )}
            </div>
        </>
    );
};

const whichComponentToRender = (
    whichInnerSidebar,
    setWhichInnerSidebar,
    bannerVisible,
    setPrevPosition,
    setPrevText,
    setPrevAppearance,
    setLanguagesSaved
) => {
    switch (whichInnerSidebar) {
        case 0:
            return (
                <MainComponent
                    setWhichInnerSidebar={setWhichInnerSidebar}
                    bannerVisible={bannerVisible}
                />
            );

        case 1:
            return (
                <PositionComponent
                    bannerVisible={bannerVisible}
                    setPrevPosition={setPrevPosition}
                />
            );

        case 2:
            return (
                <LanguagesComponent
                    bannerVisible={bannerVisible}
                    setLanguagesSaved={setLanguagesSaved}
                />
            );

        case 3:
            return (
                <AppearanceComponent
                    bannerVisible={bannerVisible}
                    setPrevAppearance={setPrevAppearance}
                />
            );
        case 4:
            return <TextComponent bannerVisible={bannerVisible} setPrevText={setPrevText} />;
    }
};

const CustomizerSidebar = ({ openLanguagesComponent, bannerVisible }) => {
    const [updateCustomizerClient] = useCustomizerMutationClient();

    const [whichInnerSidebar, setWhichInnerSidebar] = useState(openLanguagesComponent ? 2 : 0);
    const [prevPosition, setPrevPosition] = useState(null);
    const [prevText, setPrevText] = useState(null);
    const [prevAppearance, setPrevAppearance] = useState(null);
    const [languagesSaved, setLanguagesSaved] = useState(null);

    return (
        <div className="customizer-sidebar-wrapper">
            <div className="go-back">
                <GoBack
                    onClickCB={async (e) => {
                        if (whichInnerSidebar === 0) {
                            browserHistory.push('/');
                        } else {
                            setWhichInnerSidebar(0);
                        }

                        await updateCustomizerClient({
                            variables: {
                                openLanguagesComponent: false,
                                position: prevPosition,
                                text: prevText,
                                branding: prevAppearance,
                                ...(!languagesSaved && { removedItems: [], languages: null }),
                            },
                        });
                    }}
                    routerHistory={browserHistory}
                />
            </div>
            <div className="customizer-menu">
                {whichComponentToRender(
                    whichInnerSidebar,
                    setWhichInnerSidebar,
                    bannerVisible,
                    setPrevPosition,
                    setPrevText,
                    setPrevAppearance,
                    setLanguagesSaved
                )}
            </div>
        </div>
    );
};

export default CustomizerSidebar;
