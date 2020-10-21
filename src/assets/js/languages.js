import React from 'react';

const languages = {
    Arabic: {
        iso2: 'ar',
        flag: 'https://www.flaticon.com/svg/static/icons/svg/323/323322.svg',
    },
    English: {
        iso2: 'en',
        flag: 'https://www.flaticon.com/svg/static/icons/svg/197/197484.svg',
    },
    German: {
        iso2: 'de',
        flag: 'https://www.flaticon.com/svg/static/icons/svg/323/323332.svg',
    },
};

export const getLanguagesList = () => {
    return Object.keys(languages).map((language) => ({
        label: (
            <div
                style={{
                    // marginLeft: '13px',
                    // marginTop: '10px',
                    // marginBottom: '18px',
                    fontSize: '14px',
                    color: '#0a2540',
                    marginRight: '25px'
                }}
            >
                <img
                    src={languages[language].flag}
                    style={{ width: '23px', height: '23px', borderRadius: '50px' }}
                />
                <span style={{ marginLeft: '13px' }}>{language}</span>
            </div>
        ),
        value: languages[language].iso2,
    }));
};
