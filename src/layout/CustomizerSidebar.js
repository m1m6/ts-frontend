import React, { useState } from 'react';
import { Radio } from 'antd';
import { Link } from 'react-router-dom';
import { browserHistory } from '../browserHistory';
import GoBack from '../components/GoBack';
import { ReactComponent as RightArrow } from '../assets/right-arrow-angle.svg';
import { useCustomizerMutationClient } from '../translateStack/customizer/useMutations';
import { useCustomizerQueryClient } from '../translateStack/customizer/useQueries';
import Button from '../form/components/Button';
import { useMeQuery } from '../rootUseQuery';
import { mapLanguages } from '../translateStack/translation/utils';
import Select from 'react-select';

const MainComponent = ({ setWhichInnerSidebar }) => {
    return (
        <>
            <div className="customizer-menu-title">Your settings and preferences</div>
            <div className="customizer-menu-item">
                <Link
                    to="#"
                    title="Projects"
                    onClick={(e) => {
                        setWhichInnerSidebar(1);
                    }}
                >
                    Position
                    <RightArrow className="right-arrow" />
                </Link>
            </div>
            <div className="customizer-menu-item">
                <Link to="#" title="Projects" onClick={(e) => setWhichInnerSidebar(2)}>
                    Languages
                    <RightArrow className="right-arrow" />
                </Link>
            </div>
            <div className="customizer-menu-item">
                <Link to="#" title="Projects" onClick={(e) => setWhichInnerSidebar(3)}>
                    Appearance
                    <RightArrow className="right-arrow" />
                </Link>
            </div>
            <div className="customizer-menu-item">
                <Link to="#" title="Projects" onClick={(e) => setWhichInnerSidebar(4)}>
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
    const { loading, data } = useCustomizerQueryClient();
    const [updateCustomizerData] = useCustomizerMutationClient();

    if (loading) return <></>;

    let position = data && data.customizer ? data.customizer.position : '';
    console.log('position', position);

    return (
        <>
            <div className="customizer-menu-title">Position</div>
            <div className="customizer-menu-sub-title">
                Choose the position of the switcher below
            </div>

            <div className="customizer-menu-group">
                <Radio.Group
                    value={position}
                    onChange={async (e) => {
                        await updateCustomizerData({
                            variables: {
                                ...data.customizer,
                                position: e.target.value,
                            },
                        });
                    }}
                >
                    <Radio.Button value="LEFT">LEFT</Radio.Button>
                    <Radio.Button value="RIGHT">RIGHT</Radio.Button>
                    <Radio.Button value="CUSTOM">CUSTOM</Radio.Button>
                </Radio.Group>
                <Button children="SAVE" className="wf-btn-primary" style={{ ...sharedBtnStyles }} />
            </div>
        </>
    );
};

const TextComponent = ({}) => {
    const { loading, data } = useCustomizerQueryClient();
    const [updateCustomizerData] = useCustomizerMutationClient();

    if (loading) return <></>;

    let text = data && data.customizer ? data.customizer.text : '';

    return (
        <>
            <div className="customizer-menu-title">Text</div>
            <div className="customizer-menu-sub-title">
                Choose the position of the switcher below
            </div>

            <div className="customizer-menu-group">
                <Radio.Group
                    value={text}
                    onChange={async (e) => {
                        await updateCustomizerData({
                            variables: {
                                ...data.customizer,
                                text: e.target.value,
                            },
                        });
                    }}
                >
                    <Radio.Button value="FULL">FULL</Radio.Button>
                    <Radio.Button value="SHORTENED">SHORTENED</Radio.Button>
                    <Radio.Button value="FLAG_ONLY">FLAG ONLY</Radio.Button>
                </Radio.Group>
                <Button children="SAVE" className="wf-btn-primary" style={{ ...sharedBtnStyles }} />
            </div>
        </>
    );
};

const LanguagesComponent = ({}) => {
    const { data: meData, loading: meLoading } = useMeQuery();


    if (meLoading) return <></>;

    let userLanguages = meData && meData.me ? meData.me.languages : [];

    let mappedLangs = mapLanguages(userLanguages);

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
                    // value={selectedLanguages}
                    // onChange={changeHandler}
                    width="200px"
                    placeholder="Select languages"
                    isClearable={false}
                />
                <Button children="SAVE" className="wf-btn-primary" style={{ ...sharedBtnStyles }} />
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
                <GoBack onClickCB={(e) => setWhichInnerSidebar(0)} routerHistory={browserHistory} />
            </div>
            <div className="customizer-menu">
                {whichComponentToRender(whichInnerSidebar, setWhichInnerSidebar)}
            </div>
        </div>
    );
};

export default CustomizerSidebar;
