import React from 'react';
import { useLanugagesListQuery } from '../../rootUseQuery';

/*

de: "German"
en: "English"
es: "Spanish"
fr: "French"
hi: "Indian"
it: "Italian"
ja: "Japanese"
ko: "Korean"
pt: "Portuguese"
tw: "Chinese Traditional"
zh: "Chinese Simplified"

*/
export const getLanguagesList = () => {
    const { data, loading, error } = useLanugagesListQuery();

    if (error) {
        return;
    }

    if (loading) {
        return [];
    }

    const { languagesList } = data;

    return languagesList.map((language) => ({
        label: (
            <div
                style={{
                    fontSize: '14px',
                    color: '#0a2540',
                    marginRight: '25px',
                }}
            >
                <img
                    src={language.flag}
                    style={{ width: '23px', height: '23px', borderRadius: '50px' }}
                />
                <span style={{ marginLeft: '13px' }}>{language.language}</span>
            </div>
        ),
        value: language.id,
    }));
};
