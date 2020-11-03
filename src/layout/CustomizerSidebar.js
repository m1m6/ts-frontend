import React, { useState } from 'react';
import { message, Radio } from 'antd';
import { Link } from 'react-router-dom';
import { browserHistory } from '../browserHistory';
import GoBack from '../components/GoBack';
import { ReactComponent as RightArrow } from '../assets/right-arrow-angle.svg';
import {
    useCustomizerMutation,
    useCustomizerMutationClient,
} from '../translateStack/customizer/useMutations';
import { useCustomizerQueryClient } from '../translateStack/customizer/useQueries';
import Button from '../form/components/Button';
import { useMeQuery } from '../rootUseQuery';
import { mapLanguages } from '../translateStack/translation/utils';
import Select from 'react-select';
import Input from '../form/components/Input';

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
    bottom: '38px',
    position: 'absolute',
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

const PositionComponent = ({}) => {
    const { data, loading: meLoading } = useMeQuery();
    const [updateCustomizer] = useCustomizerMutation();

    const [userPosition, setUserPosition] = useState(null);
    const [customPosition, setCustomPosition] = useState(null);

    if (meLoading) return <></>;

    let customizer = data && data.me ? data.me.customizer : {};

    if (customizer && userPosition === null) {
        setUserPosition(customizer.position || 'LEFT');
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
                        setUserPosition(e.target.value);
                    }}
                >
                    <Radio.Button value="LEFT">LEFT</Radio.Button>
                    <Radio.Button value="RIGHT">RIGHT</Radio.Button>
                    <Radio.Button value="CUSTOM">CUSTOM</Radio.Button>
                </Radio.Group>
                {userPosition === 'CUSTOM' && (
                    <div className="custom-position-input">
                        <Input
                            placeholder="container"
                            value={customPosition}
                            onChange={(e) => {
                                setCustomPosition(e.target.value);
                            }}
                        />
                        <div className="hint">
                            * If id of element will not be found on the page, default position will
                            be used
                        </div>
                    </div>
                )}

                <Button
                    children="SAVE"
                    className="wf-btn-primary"
                    onClick={async (e) => {
                        const results = await updateCustomizer({
                            variables: {
                                ...data.me.customizer,
                                position: userPosition,
                                customDivId: customPosition
                            },
                        });

                        if (results.data && results.data.updateCustomizer) {
                            message.success('Successfully saved.');
                        }
                    }}
                    style={{ ...sharedBtnStyles }}
                />
            </div>
        </>
    );
};

const TextComponent = ({}) => {
    const { data, loading: meLoading } = useMeQuery();
    const [updateCustomizer] = useCustomizerMutation();

    const [userText, setUserText] = useState(null);

    if (meLoading) return <></>;

    let customizer = data && data.me ? data.me.customizer : {};

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
                        setUserText(e.target.value);
                    }}
                >
                    <Radio.Button value="FULL">FULL</Radio.Button>
                    <Radio.Button value="SHORTENED">SHORTENED</Radio.Button>
                    <Radio.Button value="FLAG_ONLY">FLAG ONLY</Radio.Button>
                </Radio.Group>
                <Button
                    children="SAVE"
                    className="wf-btn-primary"
                    onClick={async (e) => {
                        const results = await updateCustomizer({
                            variables: {
                                ...data.me.customizer,
                                text: userText,
                            },
                        });

                        if (results.data && results.data.updateCustomizer) {
                            message.success('Successfully saved.');
                        }
                    }}
                    style={{ ...sharedBtnStyles }}
                />
            </div>
        </>
    );
};

const LanguagesComponent = ({}) => {
    const [selectedLanguages, setSelectedLanguages] = useState(null);
    const { data: meData, loading: meLoading } = useMeQuery();
    const [updateCustomizer] = useCustomizerMutation();

    if (meLoading) return <></>;

    let userLanguages = meData && meData.me ? meData.me.languages : [];

    let mappedLangs = mapLanguages(userLanguages);

    let customizer = meData && meData.me ? meData.me.customizer : {};

    if (customizer && selectedLanguages === null) {
        let filteredLangs = mappedLangs.filter((lang) =>
            customizer.publishedLanguages.includes(lang.value)
        );
        setSelectedLanguages(filteredLangs);
    }

    const changeHandler = (value) => {
        setSelectedLanguages(value);
    };
    return (
        <>
            <div className="customizer-menu-title">Languages</div>
            <div className="customizer-menu-sub-title">Choose your target languages below </div>

            <div className="customizer-menu-group">
                <Select
                    styles={CustomStyle()}
                    options={mappedLangs}
                    isLoading={mappedLangs && mappedLangs.length == 0}
                    loadingMessage="Loading..."
                    isMulti={true}
                    value={selectedLanguages}
                    onChange={changeHandler}
                    width="200px"
                    placeholder="Select languages"
                    isClearable={false}
                />
                <Button
                    children="SAVE"
                    className="wf-btn-primary"
                    onClick={async (e) => {
                        const results = await updateCustomizer({
                            variables: {
                                ...meData.me.customizer,
                                publishedLanguages: selectedLanguages.map((l) => l.value),
                            },
                        });

                        if (results.data && results.data.updateCustomizer) {
                            message.success('Successfully saved.');
                        }
                    }}
                    style={{ ...sharedBtnStyles }}
                />
            </div>
        </>
    );
};

const AppearanceComponent = ({}) => {
    const { data, loading: meLoading } = useMeQuery();
    const [updateCustomizer] = useCustomizerMutation();

    const [userBranding, setUserBranding] = useState(null);

    if (meLoading) return <></>;

    let customizer = data && data.me ? data.me.customizer : {};

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
                        setUserBranding(e.target.value);
                    }}
                >
                    <Radio.Button value="WITH_BRANDING">WITH BRANDING</Radio.Button>
                    <Radio.Button value="WITHOUT_BRANDING">WITHOUT BRANDING</Radio.Button>
                </Radio.Group>
                <Button
                    children="SAVE"
                    className="wf-btn-primary"
                    onClick={async (e) => {
                        const results = await updateCustomizer({
                            variables: {
                                ...data.me.customizer,
                                appearance: userBranding,
                            },
                        });

                        if (results.data && results.data.updateCustomizer) {
                            message.success('Successfully saved.');
                        }
                    }}
                    style={{ ...sharedBtnStyles }}
                />
            </div>
        </>
    );
};

const whichComponentToRender = (whichInnerSidebar, setWhichInnerSidebar) => {
    switch (whichInnerSidebar) {
        case 0:
            return <MainComponent setWhichInnerSidebar={setWhichInnerSidebar} />;

        case 1:
            return <PositionComponent />;

        case 2:
            return <LanguagesComponent />;

        case 3:
            return <AppearanceComponent />;
        case 4:
            return <TextComponent />;
    }
};

const CustomizerSidebar = () => {
    // 0 means the main sidebar
    const [whichInnerSidebar, setWhichInnerSidebar] = useState(0);

    return (
        <div className="customizer-sidebar-wrapper">
            <div className="go-back">
                <GoBack
                    onClickCB={(e) => {
                        if (whichInnerSidebar === 0) {
                            browserHistory.push('/');
                        } else {
                            setWhichInnerSidebar(0);
                        }
                    }}
                    routerHistory={browserHistory}
                />
            </div>
            <div className="customizer-menu">
                {whichComponentToRender(whichInnerSidebar, setWhichInnerSidebar)}
            </div>
        </div>
    );
};

export default CustomizerSidebar;
