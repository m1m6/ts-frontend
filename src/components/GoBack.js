import React from 'react';
import { ReactComponent as Back } from '../assets/right-arrow.svg';

const GoBack = ({ onClickCB, routerHistory, style }) => {
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
            onClick={() => {
                if (onClickCB) {
                    onClickCB();
                } else {
                    routerHistory.goBack();
                }
            }}
        >
            <Back
                style={{
                    width: '8px',
                    height: '9px',
                    color: '#9966ff',
                    fill: '#9966ff',
                    transform: 'scale(-1,1)',
                    marginRight: '6px',
                }}
            />
            GO BACK
        </p>
    );
};

export default GoBack;
