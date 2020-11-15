import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import classNames from 'classnames';
import { browserHistory } from '../../../browserHistory';
import { useCustomizerMutationClient } from '../useMutations';
import { useCustomizerQueryClient } from '../useQueries';
import { useMeQuery, useLanugagesListQuery } from '../../../rootUseQuery';
import { mapLanguages } from '../../translation/utils';
import EmptyCustomizer from './EmptyCustomizer';
import { useUserLanguagesQuery } from '../../../user/useQueries';
import LoadingBar from 'react-top-loading-bar';

const CustomStyle = (text) => {
    return {
        option: (base, data) => {
            return {
                ...base,
                backgroundColor: '#fff',
                color: '#0a2540',
                fontSize: '12px',
                letterSpacing: '0.43px',
                fontWeight: 'bold',
                '&:active': { backgroundColor: 'rgba(227, 232, 238, 0.01)' },
                '&:hover': { backgroundColor: '#e8eaef' },

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
            '&:hover': { borderColor: 'none' },
        }),
        singleValue: (base, state) => ({
            ...base,
            fontFamily: 'Open Sans',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.43px',
        }),
        indicatorSeparator: (base, state) => ({
            ...base,
            display: 'none',
        }),
    };
};

const Customizer = ({ routerHistory, location }) => {
    const { loading, data } = useCustomizerQueryClient();
    const { data: langData, loading: langLoading } = useLanugagesListQuery();
    const { data: meData, loading: meLoading } = useMeQuery();
    const { data: userLanguagesData, loading: userLanguagesLoading } = useUserLanguagesQuery();
    const [progress, setProgress] = useState(100);

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

    if (loading || meLoading || langLoading || userLanguagesLoading) {
        return (
            <>
                <LoadingBar
                    color="#a172ff"
                    progress={progress}
                    onLoaderFinished={() => setProgress(100)}
                />
                <EmptyCustomizer />
            </>
        );
    }

    let customizer = meData && meData.me && meData.me.customizer ? meData.me.customizer : {};
    let userLanguages =
        userLanguagesData && userLanguagesData.userLanguages ? userLanguagesData.userLanguages : [];
    let systemLanguages = langData && langData.languagesList ? langData.languagesList : [];
    let sourceLanguage = systemLanguages
        .filter((l) => l.id === meData.me.sourceLanguage)
        .map((l) => {
            return {
                Language: {
                    ...l,
                },
            };
        });

    let {
        shouldOpenTheSelectOptions,
        position: localPosition,
        customDirection: localCustomDirection,
        languages: localLanguages,
        branding,
        text: localText,
        removedItems,
    } = data.customizer;

    let { position, text, appearance, customDivDirection } = customizer;

    let localLanguagesObjects = localLanguages
        ? systemLanguages.filter((l) => localLanguages.includes(l.id))
        : [];

    userLanguages = userLanguages.filter(
        ({ isActive, Language }) => isActive && !removedItems.includes(Language.id)
    );

    let userLangIds = userLanguages.map(({ Language }) => Language.id);
    let uniqueLocalLanguages = localLanguagesObjects.filter((l) => !userLangIds.includes(l.id));

    let mappedLangs = mapLanguages(
        [...uniqueLocalLanguages, ...userLanguages, ...sourceLanguage],
        localText || text,
        true
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
                        defaultValue={mappedLangs[mappedLangs.length - 1]}
                        isSearchable={false}
                        isOptionDisabled={true}
                        styles={CustomStyle(localText || text)}
                        menuPlacement={
                            (localPosition || position) === 'LEFT' ||
                            (localPosition || position) === 'RIGHT'
                                ? 'top'
                                : (localCustomDirection || '').toLowerCase() === 'up'
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
