import React, { useEffect } from 'react';
import Select, { components } from 'react-select';
import classNames from 'classnames';
import { browserHistory } from '../../../browserHistory';
import { useCustomizerMutationClient } from '../useMutations';
import { useCustomizerQueryClient } from '../useQueries';
import { useMeQuery } from '../../../rootUseQuery';
import { mapLanguages } from '../../translation/utils';

const CustomStyle = (text) => {
    return {
        option: (base, data) => {
            return {
                ...base,
                backgroundColor: '#e8eaef',
                color: '#0a2540',
                fontSize: '12px',
                letterSpacing: '0.43px',
                fontWeight: 'bold',
                '&:active': { backgroundColor: 'rgba(227, 232, 238, 0.42)' },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.01)' },
            };
        },
        container: (base, { selectProps: { width, height } }) => ({
            ...base,
            width:
                text === 'FULL' || text === 'TEXT_ONLY'
                    ? '150px'
                    : text === 'SHORTENED'
                    ? '120px'
                    : text === 'FLAG_ONLY'
                    ? '90px'
                    : '120px',
        }),
        control: (base, state) => ({
            ...base,
            border: 'solid 1px rgba(227, 232, 238, 0.42)',
            borderRadius: '2px',
            boxShadow: 'none',
            '&:hover': { borderColor: '#a172ff' },
        }),
        singleValue: (base, state) => ({
            ...base,
            fontFamily: 'Open Sans',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.43px',
        }),
    };
};

const Customizer = (props) => {
    const { loading, data } = useCustomizerQueryClient();
    const { data: meData, loading: meLoading } = useMeQuery();

    const [updateCustomizerClient] = useCustomizerMutationClient();

    async function updateCustomizerData(isOpen) {
        await updateCustomizerClient({ variables: { isOpen } });
    }

    useEffect(() => {
        browserHistory.listen(async (e) => {
            if (e.pathname !== '/customizer') {
                await updateCustomizerData(false);
            }
        });
    }, []);

    if (loading || meLoading) {
        return <></>;
    }

    let customizer = meData && meData.me && meData.me.customizer ? meData.me.customizer : {};
    let userLanguages = meData && meData.me ? meData.me.languages : [];
    let {
        shouldOpenTheSelectOptions,
        position: localPosition,
        customDirection: localCustomDirection,
        languages,
        branding,
        text: localText
    } = data.customizer;

    let { position, text, appearance, publishedLanguages, customDivDirection } = customizer;
    let mappedLangs = mapLanguages(userLanguages, (localText || text), true).filter((l) =>
        (languages || publishedLanguages).includes(l.value)
    );

    const Option = (props, index) => {
        return props.options && props.options.length && props.options[0].value === props.value ? (
            <>
                {(branding || appearance) === 'WITH_BRANDING' && (
                    <div
                        style={{
                            fontFamily: 'Open Sans',
                            fontSize: '9px',
                            lineHeight: '5.22',
                            textAlign: 'center',
                        }}
                    >
                        ⚡ by translatestack
                    </div>
                )}

                <components.Option {...props} />
            </>
        ) : (
            <components.Option {...props} />
        );
    };

    return (
        <div className="customizer-page-wrapper">
            <div className="window-container">
                <div className="window-row">
                    <div className="column left">
                        <span className="dot" style={{ background: '#ff7166' }}></span>
                        <span className="dot" style={{ background: '#ffbf66' }}></span>
                        <span className="dot" style={{ background: '#50c65c' }}></span>
                    </div>
                </div>

                <div
                    className={classNames('window-content', {
                        isLeft: (localPosition || position) === 'LEFT',
                        isRight: (localPosition || position) === 'RIGHT',
                    })}
                >
                    <Select
                        options={mappedLangs}
                        defaultValue={mappedLangs[0]}
                        isSearchable={false}
                        isOptionDisabled={true}
                        styles={CustomStyle(localText || text)}
                        menuPlacement={
                            (localCustomDirection || '').toLowerCase() === 'up'
                                ? 'top'
                                : (localCustomDirection || '').toLowerCase() === 'down'
                                ? 'bottom'
                                : customDivDirection.toLowerCase() === 'up'
                                ? 'top'
                                : 'bottom'
                        }
                        menuIsOpen={shouldOpenTheSelectOptions === true ? true : undefined}
                        components={{ Option }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Customizer;
