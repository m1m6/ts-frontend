import wordcount from 'wordcount';
import { getPageWordsCount } from '../translation/utils';

export const getProjectWordsAndStringsCount = (userPages) => {
    let wordsCount = 0;
    let stringCount = 0;

    if (userPages && userPages.length) {
        userPages.forEach(({ pageString }) => {
            wordsCount += getPageWordsCount(pageString);
            stringCount += pageString.length;
        });
    }

    return { wordsCount, stringCount };
};

export const getProjectTranslationsPercentage = (userPages, stringCount, languagesLen) => {
    let percentage = 0;
    let translationsCount = 0;

    if (userPages && userPages.length) {
        userPages.forEach(({ pageString }) => {
            pageString.forEach(({ translations }) => {
                if (translations && translations.length && translations.length > 0) {
                    translationsCount+= translations.length;
                }
            });
        });
    }

    console.log("stringCount", stringCount);
    console.log("translationsCount", translationsCount);

    percentage = (((translationsCount / languagesLen) / stringCount) * 100).toFixed(1);

    return percentage;
};
