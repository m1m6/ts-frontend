import React from 'react';

const PageLayout = ({
    history,
    Component,
    title,
    isNew,
    skippedOnboarding,
    isOpenCustomizer,
    ...rest
}) => {
    if (isOpenCustomizer) {
        return (
            <div className="customizer-page-layout">
                <Component routerHistory={history} isNew={isNew} {...rest} />
            </div>
        );
    } else if (isNew && !skippedOnboarding) {
        return (
            <div className="onboarding-page-layout">
                <Component routerHistory={history} isNew={isNew} {...rest} />
            </div>
        );
    } else
        return (
            <div className="page-layout">
                {/* <h1 className="page-title">{title}</h1> */}
                <Component routerHistory={history} isNew={isNew} {...rest} />
            </div>
        );
};

export default PageLayout;
