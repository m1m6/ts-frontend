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
		position: 'LEFT',
		text: 'FULL',
		shouldOpenTheSelectOptions: false
    },
};
