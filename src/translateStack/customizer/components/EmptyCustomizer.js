import React, { useEffect } from 'react';
import Select, { components } from 'react-select';
import classNames from 'classnames';

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
            width: '120px',
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

const EmptyCustomizer = (props) => {
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
                    className={classNames('window-content')}
                >
                    <Select
                        options={[]}
                        isSearchable={false}
                        isOptionDisabled={true}
                        styles={CustomStyle()}
                        menuPlacement={'top'}
                        menuIsOpen={false}
                        isLoading={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmptyCustomizer;
