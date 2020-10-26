import React from 'react';
import { ReactComponent as Close } from '../assets/close.svg';

const Popup = ({ text, closePopup, component: Component }) => {
    return (
        <div className="popup-box">
            <div className="box">
                <span className="close-icon" onClick={closePopup}>
                    <Close style={{ width: '10px', height: '10px', opacity: '0.28' }} />
                </span>
                <Component />
            </div>
        </div>
    );
};

export default Popup;
