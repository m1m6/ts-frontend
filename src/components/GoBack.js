import React from 'react';

const GoBack = ({ routerHistory }) => {
    return (
        <p
            style={{
                fontFamily: 'Open Sans',
                fontWeight: 'bold',
                fontSize: '12px',
                color: '#9966ff',
                cursor: 'pointer',
                marginBottom: '21px',
            }}
            onClick={() => routerHistory.goBack()}
        >
            &lt; GO BACK
        </p>
    );
};

export default GoBack;
