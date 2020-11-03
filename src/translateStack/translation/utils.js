import React from 'react';
import wordcount from 'wordcount';

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
                        ? Languages.abbreviation.toUpperCase()
                        : textAppearance && textAppearance === 'FLAG_ONLY'
                        ? ''
                        : Languages.language}
                </span>
            </div>
        ),
        value: Languages.id,
    }));
};

export const getPageWordsCount = (strings) => {
    let count = 0;

    if (strings && strings.length) {
        strings.forEach((string) => {
            count += wordcount(string.original);
        });
    }

    return count;
};

export const getTranslationsPercentageByLanguage = (strings, languageId) => {

    let percentage = 0;
    let langTranslationsCount = 0;

    if (strings && strings.length) {
        strings.forEach(({ translations }) => {
            if (translations && translations.length) {
                translations.forEach(({ languagesId }) => {
                    if (languagesId === languageId) {
                        langTranslationsCount++;
                    }
                });
            }
        });
        percentage = ((langTranslationsCount / strings.length) * 100).toFixed(1);
    }

    return percentage;
};
