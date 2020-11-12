export default {
    userData: {
        __typename: 'userData',
        id: '',
        fullName: '',
        email: '',
        role: '',
        isNew: true,
    },
    onboarding: {
        __typename: 'onboarding',
        currentStep: 1,
    },
    customizer: {
        __typename: 'customizer',
        isOpen: false,
        position: null,
        text: null,
        shouldOpenTheSelectOptions: false,
        customDirection: null,
        languages: null,
        branding: null,
        removedItems: [],
        openLanguagesComponent: false
    },
};
