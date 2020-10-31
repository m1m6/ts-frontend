import React from 'react';

export const getStringTranslation = (string, selectedLanguage) => {
    let translatedStringValue = 'n.a.';
    let updatedAtValue = string.updatedAt;

    if (string && string.translations && string.translations.length) {
        let { translations } = string;
        translations.forEach(({ languagesId, translatedString, updatedAt }) => {
            if (languagesId === selectedLanguage) {
                translatedStringValue = translatedString;
                updatedAtValue = updatedAt;
            }
        });
    }

    return { translatedStringValue, updatedAtValue };
};

export const mapLanguages = (languagesList, textAppearance) => {
    return languagesList.map(({ Languages }) => ({
        label: (
            <div
                style={{
                    fontSize: '14px',
                    color: '#0a2540',
                    marginRight: '25px',
                }}
            >
                <img
                    src={Languages.flag}
                    style={{ width: '23px', height: '23px', borderRadius: '50px' }}
                />
                <span style={{ marginLeft: '13px' }}>
                    {textAppearance && textAppearance === 'SHORTENED'
                        ? Languages.language.substring(0, 2).toUpperCase()
                        : textAppearance && textAppearance === 'FLAG_ONLY'
                        ? ''
                        : Languages.language}
                </span>
            </div>
        ),
        value: Languages.id,
    }));
};
