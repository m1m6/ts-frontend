import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import centerLogo from '../../assets/imgs/signupLogin/icon-bubble.png';
import heart from '../../assets/heart.png';
import Button from '../../form/components/Button';
import Input from '../../form/components/Input';
import { useSubscriptionMutation } from '../useMutation';
import { usePlansListQuery } from '../useQuery';
import { mapPlans } from '../utils';
import { useUserSubscriptionPlan } from '../../user/useQueries';

const Upgrade = ({ preStep = 1, subscriptionCycle, setShowPopup, targetPlan}) => {
    const [step, setStep] = useState(preStep);

    return (
        <div className="upgrade-popup">
            {step === 1 ? (
                <>
                    <div
                        className="center-logo"
                        style={{
                            marginTop: '100px',
                            marginLeft: '-49px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <img src={centerLogo} width="40%" style={{ marginLeft: '-10%' }} />
                    </div>
                    <div className="popup-title">
                        Ups, you need to upgrade to <br /> use premium features
                    </div>
                    <div className="popup-sub-title">
                        Es ist essentiell, dass du deine Bachelorarbeit auf etablierte
                        <br /> internationale Journals und Research Paper stützt. Verwend
                    </div>

                    <div className="popup-next-btn">
                        <Button
                            children="NEXT"
                            className="wf-btn-primary"
                            onClick={() => setStep(2)}
                        />
                    </div>
                </>
            ) : step === 2 ? (
                <Step2
                    setStep={setStep}
                    subscriptionCycle={subscriptionCycle}
                    setShowPopup={setShowPopup}
                    targetPlan={targetPlan}
                />
            ) : (
                <Step3 />
            )}
        </div>
    );
};

const Step2 = ({ setStep, setShowPopup, targetPlan }) => {
    const subscriptionCycleOptions = [
        { label: 'YEARLY', value: 'yearly' },
        { label: 'MONTHLY', value: 'monthlu' },
    ];
    const { data, loading } = usePlansListQuery();
    const { data: userData, loading: userLoading } = useUserSubscriptionPlan();

    const [cycle, setCycle] = useState(subscriptionCycleOptions[0]);
    const [plan, setPlan] = useState(undefined);
    const [cardNumber, setCardNumber] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);
    const [cvc, setCvc] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [subscribe] = useSubscriptionMutation();
    const textInput1 = useRef(null);
    const textInput2 = useRef(null);
    const textInput3 = useRef(null);

    useEffect(() => {
        textInput1.current.focus();
        if (cardNumber && cardNumber.length === 19) {
            textInput1.current.blur();
            textInput2.current.focus();
        }

        if (expiryDate && expiryDate.length === 5) {
            textInput2.current.blur();
            textInput3.current.focus();
        }
    });

    const { status, plan: currentPlan, subscriptionCycle } =
        userData && userData.getUserPlan
            ? userData.getUserPlan
            : { status: 'BASIC', plan: { id: 1 } };

    const plansOptions = mapPlans(data, cycle.label, status, targetPlan);

    useEffect(() => {
        if (plan === undefined && plansOptions.length > 0) {
            setPlan(plansOptions[targetPlan - 2]);
        }
    })

    const shouldDisableCycleList = subscriptionCycle === 'yearly';
    return (
        <>
            <div className="popup-title">
                Choose your plan that fits
                <br />
                to your needs
            </div>
            <div className="subscription-form">
                <div className="field-title">SUBCRIPTION</div>
                <Select
                    styles={CustomStyle(true)}
                    options={subscriptionCycleOptions}
                    defaultValue={subscriptionCycleOptions[0]}
                    isDisabled={shouldDisableCycleList}
                    formatOptionLabel={(value) => {
                        if (value.label === 'YEARLY') {
                            return (
                                <div>
                                    {value.label}
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            marginLeft: '10px',
                                            borderRadius: '4px',
                                            boxShadow: '0 2px 20px -5px #e8eaef',
                                            backgroundColor: '#e7dcfe',
                                            color: '#a172ff',
                                            fontWeight: 'bold',
                                            padding: '5px',
                                        }}
                                    >
                                        20% SAVINGS
                                    </span>
                                </div>
                            );
                        }
                        return <div>{value.label}</div>;
                    }}
                    value={cycle}
                    onChange={(e) => {
                        const plansOptions = mapPlans(data, e.label);
                        setPlan(plansOptions.filter((o) => o.value === plan.value)[0]);
                        setCycle(e);
                    }}
                    width="100%"
                    isClearable={false}
                    isSearchable={false}
                />
                <Select
                    styles={CustomStyle()}
                    isLoading={loading}
                    options={plansOptions}
                    defaultValue={plansOptions[0]}
                    value={plan}
                    onChange={(e) => setPlan(e)}
                    width="100%"
                    isClearable={false}
                    isSearchable={false}
                    isOptionDisabled={(option) => option.isdisabled}
                />

                <div
                    style={{ marginTop: '40px', display: 'flex', marginTop: '40px', width: '100%' }}
                >
                    <div style={{ width: '40%' }}>
                        <div style={cardLabel}>CREDIT CARD NUMBER</div>
                        <input
                            className="ts-input"
                            size="large"
                            type="text"
                            style={cardInput}
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            ref={textInput1}
                            onChange={(e) => {
                                var code = e.which ? e.which : e.keyCode;
                                if (code < 48 || code > 57) {
                                    e.preventDefault();
                                }
                                return setCardNumber(formatCardNumber(e.target.value));
                            }}
                            onKeyPress={(e) => {
                                var code = e.which ? e.which : e.keyCode;
                                if (code < 48 || code > 57) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <div style={{ marginLeft: '20px', width: '30%' }}>
                        <div style={cardLabel}>EXPIRY DATE</div>
                        <input
                            className="ts-input"
                            size="large"
                            type="text"
                            style={cardInput}
                            placeholder="12/25"
                            ref={textInput2}
                            maxLength="5"
                            value={expiryDate}
                            onChange={(e) => {
                                var code = e.keyCode;
                                if (code === 8) {
                                    e.preventDefault();
                                }
                                return setExpiryDate(formatExpiryDate(e.target.value));
                            }}
                            onKeyPress={(e) => {
                                var code = e.keyCode;
                                if (code === 8) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <div style={{ marginLeft: '20px', width: '30%' }}>
                        <div style={cardLabel}>CVC</div>
                        <input
                            className="ts-input"
                            size="large"
                            type="text"
                            ref={textInput3}
                            style={cardInput}
                            placeholder="123"
                            maxLength="3"
                            value={cvc}
                            onChange={(e) => {
                                setCvc(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className="popup-next-btn">
                    <Button
                        children={isSubmitting ? 'UPGRADING...' : 'UPGRADE'}
                        className={classNames('wf-btn-primary', {
                            disabled: isSubmitting,
                        })}
                        disabled={isSubmitting}
                        onClick={async (e) => {
                            try {
                                setSubmitting(true);
                                if (
                                    !cardNumber ||
                                    (cardNumber && cardNumber.replaceAll(' ', '').length !== 16)
                                ) {
                                    message.warn('Please enter valid credit card number');
                                    setSubmitting(false);
                                    return;
                                }

                                if (
                                    !expiryDate ||
                                    (expiryDate && expiryDate.replace('/', '').length !== 4)
                                ) {
                                    message.warn('Please enter valid date');
                                    setSubmitting(false);
                                    return;
                                }

                                if (expiryDate && expiryDate.split('/')[1]) {
                                    let date = new Date();
                                    let year = expiryDate.split('/')[1];
                                    let currentYear = date.getFullYear().toString().substring(2);

                                    if (parseInt(year) < parseInt(currentYear)) {
                                        setSubmitting(false);
                                        message.warn('Past date are not valid');
                                        return;
                                    }
                                }

                                if (!cvc || cvc.length < 3) {
                                    message.warn('Please enter cvc');
                                    setSubmitting(false);
                                    return;
                                }

                                const cardNumberValue = cardNumber.replaceAll(' ', '');
                                const [expMonth, expYear] = expiryDate.split('/');

                                console.log(cardNumberValue, expMonth, expYear, cvc);
                                console.log('plan', plan.value);
                                console.log('cycle', cycle.value);

                                const subscripeResults = await subscribe({
                                    variables: {
                                        cardNumber: cardNumberValue,
                                        expMonth,
                                        expYear,
                                        cvc,
                                        planId: plan.value,
                                        cycle: cycle.value,
                                    },
                                });

                                if (
                                    subscripeResults &&
                                    subscripeResults.data &&
                                    subscripeResults.data.subscription &&
                                    subscripeResults.data.subscription.status &&
                                    subscripeResults.data.subscription.status === 'PREMIUM'
                                ) {
                                    message.success('Your subscription has been upgraded!');
                                    setShowPopup(false);
                                    // setStep(3);
                                } else {
                                    console.log('subscripeResults', subscripeResults);
                                    message.error(
                                        'Oops, unable to complete this process, pleae try again later.'
                                    );
                                }

                                setTimeout(() => {
                                    setSubmitting(false);
                                }, 100);
                            } catch (error) {
                                message.error('Unable to subscripe now, please try again later!');
                                setSubmitting(false);
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );
};

const Step3 = () => {
    return (
        <>
            <div
                className="center-logo"
                style={{
                    marginTop: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '118px',
                    marginLeft: '20px',
                }}
            >
                <img src={heart} width="150px" />
            </div>
            <div className="popup-title">
                Congrats, all set up. <br />
                Start building.
            </div>
        </>
    );
};
export const formatCardNumber = (value) => {
    var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    var matches = v.match(/\d{4,16}/g);
    var match = (matches && matches[0]) || '';
    var parts = [];
    var len = match.length;
    for (let i = 0; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
        return parts.join(' ');
    } else {
        return value;
    }
};

export const formatExpiryDate = (value) => {
    return value
        .replace(
            /[^0-9]/g,
            '' // To allow only numbers
        )
        .replace(
            /^([2-9])$/g,
            '0$1' // To handle 3 > 03
        )
        .replace(
            /^(1{1})([3-9]{1})$/g,
            '0$1/$2' // 13 > 01/3
        )
        .replace(
            /^0{1,}/g,
            '0' // To handle 00 > 0
        )
        .replace(
            /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
            '$1/$2' // To handle 113 > 11/3
        );
};

const cardLabel = {
    fontFamily: 'Open Sans',
    fontSize: '14px',
    color: '#0a2540',
    marginBottom: '14px',
};

const cardInput = {
    fontFamily: 'Open Sans',
    fontSize: '14px',
    color: '#a7b0ba',
    height: '65px',
    width: '100%',
    ':placeholder': {
        fontSize: '14px',
    },
};

const CustomStyle = (isFirst) => {
    return {
        option: (base, data) => {
            return {
                ...base,
                backgroundColor: '#fff',
                color: '#0a2540',
                fontSize: '14px',
                '&:active': { backgroundColor: 'rgba(227, 232, 238, 0.01)' },
                '&:hover': { backgroundColor: '#e8eaef' },
            };
        },
        menu: (provided, state) => ({
            ...provided,
            width: state.selectProps.width,
        }),
        container: (base, { selectProps: { width, height } }) => ({
            ...base,
            marginTop: '13px',
            height: isFirst ? '100%' : height,
        }),
        control: (base, state) => ({
            ...base,
            border: 'solid 1px rgba(227, 232, 238, 0.42)',
            borderRadius: '2px',
            boxShadow: 'none',
            '&:hover': { borderColor: 'none' },
            height: isFirst ? '65px' : '100px',
        }),
        singleValue: (base, { isDisabled, selectProps: { width, height } }) => {
            console.log('isDisabled', isDisabled);
            return {
                ...base,
                width: '100%',
                fontFamily: 'Open Sans',
                fontSize: '14px',
                // color: isDisabled ? '#ccc' : '#0a2540',
                // opacity: isDisabled ? 0.5 : 1,
            };
        },
        indicatorSeparator: (base, state) => ({
            ...base,
            display: 'none',
        }),
        valueContainer: (base, { selectProps: { width, height } }) => ({
            ...base,
            height: !isFirst ? '100%' : height,
        }),
    };
};

export default Upgrade;
