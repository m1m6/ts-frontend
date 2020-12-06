import React from 'react';
import centerLogo from '../assets/imgs/signupLogin/icon-bubble.png';

export const mapPlans = (plansData, cycle = 'YEARLY', status, targetPlan) => {
    let options = [];
    if (plansData && plansData.plans && plansData.plans.length) {
        let plansOptions = JSON.parse(JSON.stringify(plansData.plans));
        const sortedOptions = plansOptions.sort((a, b) => a.id - b.id);
        const filteredOptions = sortedOptions.filter((o) => o.id > 1);

        filteredOptions.forEach((plan) => {
            const option = {};

            option.isdisabled = status === 'PREMIUM' && plan.id <= targetPlan;

            option.value =
                cycle === 'YEARLY'
                    ? `${plan.id}/${plan.yearlyPriceId}`
                    : `${plan.id}/${plan.monthlyPriceId}`;

            option.label = (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div className="center-logo">
                        <img src={centerLogo} width="94px" style={{ marginLeft: '-15%' }} />
                    </div>
                    <div style={{ width: '100%' }}>
                        <span
                            style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: !option.isdisabled ? '#0a2540' : '#ccc',
                                fontFamily: 'Open Sans',
                            }}
                        >
                            {capitalizeFirstLetter(plan.type)}
                        </span>
                        <span
                            style={{
                                marginLeft: '5px',
                                fontFamily: 'Open Sans',
                                fontSize: '16px',
                                color: !option.isdisabled ? '#0a2540' : '#ccc',
                                
                            }}
                        >
                            (
                            {`${plan.pages} Pages, ${
                                plan.id === 4 ? 'all' : plan.targetLanguages
                            } Languages${plan.id > 2 ? ', removed branding' : ''}`}
                            )
                        </span>
                        <span
                            style={{
                                marginLeft: '10px',
                                fontFamily: 'Open Sans',
                                fontSize: '20px',
                                color: !option.isdisabled ? '#0a2540' : '#ccc',
                                fontWeight: 'bold',
                                float: 'right',
                                marginRight: '40px',
                            }}
                        >
                            {cycle === 'YEARLY'
                                ? `$${plan.yearlyPriceAmount}/m`
                                : `$${plan.monthlyPriceAmount}/m`}
                        </span>
                    </div>
                </div>
            );

            options.push(option);
        });
    }

    return options;
};

export const capitalizeFirstLetter = (string) => {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
};
