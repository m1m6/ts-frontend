import React from 'react';
import { useLanugagesListQuery } from '../../rootUseQuery';
import { useUserLanguagesQuery } from '../../user/useQueries';


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

export const getUserLangaugesList = () => {
    const { data, loading, error} = useUserLanguagesQuery();

    if (error) {
        return;
    }

    if (loading) {
        return [];
    }

    const { userLanguages } = data;

    return userLanguages
        .filter(({ isActive }) => isActive)
        .map(({ Language }) => ({
            label: (
                <div
                    style={{
                        fontSize: '14px',
                        color: '#0a2540',
                        marginRight: '25px',
                    }}
                >
                    <img
                        src={Language.flag}
                        style={{ width: '23px', height: '23px', borderRadius: '50px' }}
                    />
                    <span style={{ marginLeft: '13px' }}>{Language.language}</span>
                </div>
            ),
            value: Language.id,
        }));
};
