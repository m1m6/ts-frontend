import React, { useLayoutEffect } from 'react';
import { auth } from '../signupLogin/auth';
import { ReactComponent as Logo } from '../assets/logo.svg';
import centerLogo from '../assets/imgs/signupLogin/icon-bubble.png';
import { ReactComponent as CheckLogo } from '../assets/check.svg';
import Link from '../form/components/Link';

const AuthPageLayout = ({ history, Component, title, headerLink, ...rest }) => {
    useLayoutEffect(() => {
        const token = auth.getAccessToken();
        if (token !== null) {
            history.push('/');
        }
    }, []);

    return (
        <div className="auth-page-layout">
            <div
                style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: '#FCFDFE',
                    border: 'solid 1px rgba(227, 232, 238, 0.42)',
                    paddingLeft: '49px',
                    paddingTop: '18px',
                }}
            >
                <Logo />
                <div
                    className="center-logo"
                    style={{
                        marginTop: '200px',
                        marginLeft: '-49px',
                        marginTop: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <img src={centerLogo} width="50%" style={{ marginLeft: '-10%' }} />
                </div>
                <div
                    className="features"
                    style={{
                        marginLeft: '8.7vw',
                        fontFamily: 'Open Sans',
                        fontSize: '18px',
                        lineHeight: '1.67',
                        color: '#4d5e6e',
                        marginTop: '71px',
                    }}
                >
                    <div style={{ marginBottom: '24px' }}>
                        <CheckLogo
                            width={'17px'}
                            height={'17px'}
                            fill="rgba(153, 102, 255, 0.38)"
                        />
                        <span style={{ marginLeft: '13px' }}>Sign Up for free</span>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <CheckLogo
                            width={'17px'}
                            height={'17px'}
                            fill="rgba(153, 102, 255, 0.38)"
                        />
                        <span style={{ marginLeft: '13px' }}>Scalable to your needs</span>
                    </div>

                    <div>
                        <CheckLogo
                            width={'17px'}
                            height={'17px'}
                            fill="rgba(153, 102, 255, 0.38)"
                        />
                        <span style={{ marginLeft: '13px' }}>
                            Encrypted service with SSL connection
                        </span>
                    </div>
                </div>
                <div
                    className="auth-footer"
                    style={{
                        marginLeft: '8.7vw',
                        position: 'absolute',
                        bottom: '38px',
                        fontSize: '12px',
                        color: '#0a2540',
                    }}
                >
                    <span>translatestack 2020 ©</span>
                    <span style={{ paddingLeft: '44px' }}>Terms & Conditions</span>
                </div>
            </div>

            <div class="auth-page-container">
                {headerLink && (
                    <Link
                        label={
                            <div
                                style={{
                                    position: 'absolute',
                                    right: '57px',
                                    top: '38px',
                                    float: 'none',
                                    color: '#0a2540',
                                    fontSize: '14px',
                                    opacity: '0.37',
                                    fontWeight: 'bold',
                                }}
                            >
                                {headerLink.title}
                            </div>
                        }
                        to={headerLink.to}
                    ></Link>
                )}
                <h1 style={{ fontWeight: '700' }}>{title}</h1>
                <Component routerHistory={history} {...rest} />
            </div>
        </div>
    );
};

export default AuthPageLayout;
