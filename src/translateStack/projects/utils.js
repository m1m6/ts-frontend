import wordcount from 'wordcount';
import { getPageWordsCount } from '../translation/utils';

export const getProjectWordsAndStringsCount = (userPages) => {
    let wordsCount = 0;
    let stringCount = 0;

    if (userPages && userPages.length) {
        userPages.forEach(({ strings }) => {
            wordsCount += getPageWordsCount(strings);
            stringCount += strings.length;
        });
    }

    return { wordsCount, stringCount };
};

export const getProjectTranslationsPercentage = (userPages, stringCount) => {
    let percentage = 0;
    let translationsCount = 0;

    if (userPages && userPages.length) {
        userPages.forEach(({ strings }) => {
            strings.forEach(({ translations }) => {
                if (translations && translations.length && translations.length > 0) {
                    translationsCount++;
                }
            });
        });
    }

    percentage = ((translationsCount / stringCount) * 100).toFixed(1);

    return percentage;
};
