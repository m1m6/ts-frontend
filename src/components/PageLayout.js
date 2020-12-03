import React, { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';

const PageLayout = ({
    history,
    Component,
    title,
    isNew,
    skippedOnboarding,
    isOpenCustomizer,
    userRole,
    ...rest
}) => {
    const [loading, setLoading] = useState(true);

    // // useEffect(() => {
    // //     if (loading) {
    // //         setLoading(false);
    // //     }
    // // }, [loading]);

    // if (loading) {
    //     return (
    //         <LoadingBar
    //             color="#a172ff"
    //             progress={50}
    //         />
    //     );
    // }
    if (isOpenCustomizer) {
        return (
            <div className="customizer-page-layout">
                <Component routerHistory={history} isNew={isNew} {...rest} />
            </div>
        );
    } else if (isNew) {
        return (
            <div className="onboarding-page-layout">
                <Component routerHistory={history} isNew={isNew} {...rest} />
            </div>
        );
    } else
        return (
            <div className="page-layout">
                {/* <h1 className="page-title">{title}</h1> */}
                <Component routerHistory={history} isNew={isNew} userRole={userRole} {...rest} />
            </div>
        );
};

export default PageLayout;
