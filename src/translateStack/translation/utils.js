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
