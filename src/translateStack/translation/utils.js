import React from 'react';
import wordcount from 'wordcount';

export const getStringTranslation = (string, selectedLanguage) => {
    let translatedStringValue = null;
    let updatedAtValue = string.updatedAt;
    if (string && string.translations && string.translations.length) {
        let { translations } = string;
        translations.forEach(({ languageId, translatedString, updatedAt }) => {
            if (languageId === selectedLanguage) {
                translatedStringValue = translatedString;
                updatedAtValue = updatedAt;
            }
        });
    }

    return { translatedStringValue, updatedAtValue };
};

export const mapLanguages = (languagesList, textAppearance, shouldShowLocalName = false) => {
    return languagesList.map(({ Language }) => ({
        label: (
            <div
                style={{
                    fontSize: '14px',
                    color: '#0a2540',
                    marginRight: '25px',
                }}
            >
                {textAppearance !== 'TEXT_ONLY' && (
                    <img
                        src={Language.flag}
                        style={{ width: '23px', height: '23px', borderRadius: '50px' }}
                    />
                )}

                <span style={{ marginLeft: '13px' }}>
                    {textAppearance && textAppearance === 'SHORTENED'
                        ? Language.abbreviation.toUpperCase()
                        : textAppearance && textAppearance === 'FLAG_ONLY'
                        ? ''
                        : shouldShowLocalName
                        ? Language.localName
                        : Language.language}
                </span>
            </div>
        ),
        value: Language.id,
    }));
};

export const getPageWordsCount = (pageString) => {
    let count = 0;

    if (pageString && pageString.length) {
        pageString.forEach((string) => {
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
                translations.forEach(({ languageId }) => {
                    if (languageId === languageId) {
                        langTranslationsCount++;
                    }
                });
            }
        });
        percentage = ((langTranslationsCount / strings.length) * 100).toFixed(1);
    }

    return percentage;
};
