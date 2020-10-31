import React, { useEffect } from 'react';
import Select from 'react-select';
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
            width: text === 'FULL' ? '150px' : text === 'SHORTENED' ? '120px' : '85px',
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
            // opacity: '0.29',
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

    let customizer = data && data.customizer ? data.customizer : {};
    let userLanguages = meData && meData.me ? meData.me.languages : [];

    let { position, text } = customizer;
    let mappedLangs = mapLanguages(userLanguages, text);

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
                        isLeft: position === 'LEFT',
                        isRight: position === 'RIGHT',
                    })}
                >
                    <Select
                        options={mappedLangs}
                        defaultValue={mappedLangs[0]}
                        isSearchable={false}
                        isClearable={false}
                        isOptionDisabled={true}
                        styles={CustomStyle(text)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Customizer;
