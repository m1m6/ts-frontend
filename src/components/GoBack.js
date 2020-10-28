import React from 'react';

const GoBack = ({ routerHistory, style }) => {
    return (
        <p
            style={{
                fontFamily: 'Open Sans',
                fontWeight: 'bold',
                fontSize: '12px',
                color: '#9966ff',
                cursor: 'pointer',
                marginBottom: '21px',
                ...style,
            }}
            onClick={() => routerHistory.goBack()}
        >
            &lt; GO BACK
        </p>
    );
};

export default GoBack;
