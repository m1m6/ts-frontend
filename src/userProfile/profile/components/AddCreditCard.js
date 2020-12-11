import React, { useEffect, useRef, useState } from 'react';
import { Grid } from 'svg-loaders-react';
import { message } from 'antd';
import classNames from 'classnames';
import Button from '../../../form/components/Button';
import { useAddCreditCardMutation, useInviteUserMutation } from '../useMutations';
import { formatCardNumber, formatExpiryDate } from '../../../upgrade/components/Upgrade';

const cardInput = {
    fontFamily: 'Open Sans',
    fontSize: '14px',
    color: '#a7b0ba',
    height: '65px',
    width: '100%',
    ':placeholder': {
        fontSize: '12px',
    },
};

const AddCreditCard = ({ setShowPopup }) => {
    const [cardNumber, setCardNumber] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);
    const [cvc, setCvc] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const textInput1 = useRef(null);
    const textInput2 = useRef(null);
    const textInput3 = useRef(null);

    const [addCreditCard] = useAddCreditCardMutation();

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

    return (
        <div className="credit-card-popup">
            <div className="credit-card-form">
                <>
                    <div className="popup-title">Add new Credit Card</div>
                    <div className="credit-card-inner-form">
                        <div style={{ marginBottom: '30px' }}>
                            <div className="field-name">CARD NUMBER</div>
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
                        <div style={{ marginBottom: '30px' }}>
                            <div className="field-name">EXPIRY DATE</div>
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

                        <div>
                            <div className="field-name">CVC</div>
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
                            // htmlType="submit"
                            type="primary"
                            disabled={isSubmitting}
                            className={classNames('wf-btn-primary', {
                                disabled: isSubmitting,
                            })}
                            onClick={async (e) => {
                                try {
                                    setSubmitting(true);
                                    if (
                                        !cardNumber ||
                                        (cardNumber && cardNumber.replaceAll(' ', '').length !== 16)
                                    ) {
                                        message.warn('Please enter valid credit card number');
                                        setSubmitting(false);
                                        return false;
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
                                        let currentYear = date
                                            .getFullYear()
                                            .toString()
                                            .substring(2);

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

                                    const results = await addCreditCard({
                                        variables: {
                                            cardNumber: cardNumberValue,
                                            expMonth,
                                            expYear,
                                            cvc,
                                        },
                                    });

                                    if (
                                        results &&
                                        results.data &&
                                        results.data.addCustomerCreditCard
                                    ) {
                                        message.success(
                                            'Your credit card has been added successfully!'
                                        );
                                        setShowPopup(false);
                                    } else {
                                        message.error(
                                            'Oops, unable to complete this process, pleae try again later.'
                                        );
                                        setShowPopup(false);
                                    }

                                    setTimeout(() => {
                                        setSubmitting(false);
                                    }, 100);
                                } catch (error) {
                                    message.error(
                                        'Unable to add this credit card now, please try again later!'
                                    );
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {isSubmitting ? (
                                <Grid style={{ width: '17px', height: '17px' }} />
                            ) : (
                                <>ADD</>
                            )}
                        </Button>
                    </div>
                </>
            </div>
        </div>
    );
};

export default AddCreditCard;
