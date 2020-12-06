import { message, Skeleton, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Grid } from 'svg-loaders-react';
import LoadingBar from 'react-top-loading-bar';
import { format } from 'date-fns';
import Button from '../../../form/components/Button';
import { ReactComponent as CheckLogo } from '../../../assets/check.svg';
import { Rings } from 'svg-loaders-react';
import { useUserPagesQuery } from '../useQueries';
import { useMeQuery } from '../../../rootUseQuery';
import { useUpdateUserMutation } from '../../../user/useMutations';
import { useOnboardingMutationClient } from '../../onboarding/useMutations';
import { browserHistory } from '../../../browserHistory';
import { copyToClipboard } from '../../../utils/generalUtils';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Input from '../../../form/components/Input';
import Popup from '../../../components/Popup';
import { useAddSinglePageMutation } from '../useMutations';
import { getProjectTranslationsPercentage, getProjectWordsAndStringsCount } from '../utils';
import { getTranslationsPercentageByLanguage } from '../../translation/utils';
import { useUserLanguagesQuery, useUserSubscriptionPlan } from '../../../user/useQueries';
import { OnboardinButton } from '../../onboarding/components/Onboarding';
import { isDeveloper, isEditor } from '../../../signupLogin/utils';
import { useSetUpgradeDataClient } from '../../../upgrade/useMutation';

SyntaxHighlighter.registerLanguage('jsx', jsx);

const columns = [
    {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
    },
    {
        title: 'STRINGS',
        dataIndex: 'strings',
        key: 'strings',
    },
    {
        title: 'Translated',
        dataIndex: 'translated',
        key: 'translated',
    },
    {
        title: 'LAST EDIT',
        dataIndex: 'lastEdit',
        key: 'lastEdit',
    },
];

const placeHolderRow = [
    {
        key: '1',
        url: 'n. a.',
        strings: 'n. a.',
        translated: 'n. a.',
        lastEdit: 'n. a.',
    },
];

const SetupPopup = ({ setShowPopup, apiKey, pagesCount }) => {
    let [pageUrl, setPageUrl] = useState(undefined);
    let [isSubmitting, setIsSubmitting] = useState(false);
    const [useAddSinglePage] = useAddSinglePageMutation();
    const [updateUpgradeData] = useSetUpgradeDataClient();
    const { data: userPlan, loading } = useUserSubscriptionPlan();

    if (loading) return <></>;

    return (
        <div className="setup-popup-wrapper">
            <div className="setup-p-title">Add another page</div>
            <div className="setup-p-description">
                Copy your code snippet below and place it above the closing tag &#60;/head&#62; of your page.
                Afterwards, enter the URL to test your integration.
            </div>
            <div className="setup-p-code">
                <div className="setup-code">
                    <Button children="COPY" onClick={(e) => copyToClipboard('code-snippet')} />
                    <SyntaxHighlighter language="javascript" style={dark} id="code-snippet">
                        {`<script id="tss-script" src="https://app.translatestack.com/sdk/sdk.js?apiKey=${apiKey}"></script>`}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="setup-p-d-w">
                <div className="setup-p-d-t">Enter URL of the page</div>
                <div className="setup-p-d-d">
                    After you placed the code snippet in the new page, you can test the
                    implementation. Just enter the valid URL and press the button.
                </div>
                <div className="setup-p-d-i">
                    <Input
                        placeholder="https://yourwebsite.com"
                        value={pageUrl}
                        onChange={(e) => {
                            setPageUrl(e.target.value);
                        }}
                    />
                </div>
                <div className="setup-p-d-s">
                    <OnboardinButton
                        isActive={true}
                        // className={classNames('wf-btn-primary', {
                        //     active: dirty && Object.keys(errors).length === 0,
                        // })}
                        label={
                            isSubmitting ? (
                                <Grid style={{ width: '17px', height: '17px' }} />
                            ) : (
                                'TEST SETUP'
                            )
                        }
                        disabled={isSubmitting}
                        onClick={async () => {
                            const currentUserPlan =
                                userPlan && userPlan.getUserPlan && userPlan.getUserPlan.plan
                                    ? userPlan.getUserPlan.plan.id
                                    : 1;

                            if (
                                currentUserPlan === 1 &&
                                pagesCount.length > 5 &&
                                pagesCount.length <= 10
                            ) {
                                await updateUpgradeData({
                                    variables: {
                                        shouldShowUpgradePopup: true,
                                        targetPlan: 2,
                                    },
                                });
                            } else if (
                                currentUserPlan === 2 &&
                                pagesCount.length > 10 &&
                                pagesCount.length <= 20
                            ) {
                                await updateUpgradeData({
                                    variables: {
                                        shouldShowUpgradePopup: true,
                                        targetPlan: 3,
                                    },
                                });
                            } else if (currentUserPlan === 3 && pagesCount.length > 20) {
                                await updateUpgradeData({
                                    variables: {
                                        shouldShowUpgradePopup: true,
                                        targetPlan: 4,
                                    },
                                });
                            } else {
                                setIsSubmitting(true);
                                if (pageUrl && /^(http|https):\/\/[^ "]+$/.test(pageUrl)) {
                                    const results = await useAddSinglePage({
                                        variables: { pageUrl },
                                    });

                                    if (results && results.data && results.data.addSinglePage) {
                                        message.success('Page successfully added');
                                        setShowPopup(false);
                                        await updateUpgradeData({
                                            variables: {
                                                shouldShowUpgradePopup: true,
                                            },
                                        });
                                    } else {
                                        message.warn('Unable to verify the page');
                                    }
                                } else {
                                    message.error('Please enter a valid page url');
                                }

                                setIsSubmitting(false);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const mapRows = (pages, userLanguagesData) => {
    let rows = [];

    if (pages && pages.length) {
        pages.forEach((page, i) => {
            let row = {};

            row.key = i;
            row.url = (
                <span style={{ display: 'inline-flex' }}>
                    {page.pageUrl}{' '}
                    {page.pageString.length === 0 && (
                        <span
                            style={{
                                marginLeft: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                className="ring-container"
                                style={{ marginTop: '0px', width: '25px', height: '25px' }}
                            >
                                <div className="ringring" style={{ top: '0px', left: '0px' }}></div>
                                <div className="circle" style={{ top: '5px', left: '5px' }}></div>
                            </div>
                            <span
                                style={{
                                    color: '#9966ff',
                                    borderRadius: '50%',
                                    fontFamily: 'Open Sans',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    marginLeft: '6px',
                                }}
                            >
                                FETCHING DATA
                            </span>
                        </span>
                    )}
                </span>
            );
            row.strings = page.pageString.length;
            row.translated = `${getTranslationsPercentageByLanguage(
                page.pageString,
                null,
                userLanguagesData.userLanguages.length
            )}%`;
            row.lastEdit = format(new Date(page.updatedAt).getTime(), 'd. MMM');
            row.pageId = page.id;

            rows.push(row);
        });
    }
    return rows;
};

const Projects = ({ routerHistory }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [progress, setProgress] = useState(10);

    const { data, loading, error } = useUserPagesQuery();
    const { data: userData, loading: userLoading, error: userError } = useMeQuery();
    const [updateUser] = useUpdateUserMutation();
    const [updateOnboardingClient] = useOnboardingMutationClient();
    const { data: userLanguagesData, loading: userLanguagesLoading } = useUserLanguagesQuery();

    let dataSource = placeHolderRow;

    // useEffect(() => {
    //     if (loading || userLoading || userLanguagesLoading) {
    //         setProgress(100);
    //     }
    //     // return () => {
    //     //     setProgress(0);
    //     // };
    // }, []);

    if (error) {
        return <div style={{ margin: '0 auto' }}>Unable to parse your request </div>;
    }

    if (loading || userLoading || userLanguagesLoading) {
        return (
            <LoadingBar
                color="#a172ff"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
        );
    } else {
        if (data && data.userPages) {
            dataSource = mapRows(data.userPages, userLanguagesData);
        }
    }

    let hasFinishedSetup = userData && userData.me ? !userData.me.isNew : false;
    let apiKey = userData && userData.me ? userData.me.apiKey : '';
    let userRole = userData && userData.me ? userData.me.role : '';

    let { wordsCount, stringCount } = getProjectWordsAndStringsCount(data.userPages);
    let percentageTranslations = getProjectTranslationsPercentage(
        data.userPages,
        stringCount,
        userLanguagesData ? userLanguagesData.userLanguages.length : 1
    );

    return (
        <div className="projects-page-wrapper">
            <div className="projects-page-header">
                <div className="ls">
                    <div className="projects-inner-title">Project</div>
                    <div className="project-name">
                        {hasFinishedSetup
                            ? data.userPages &&
                              data.userPages[0] &&
                              data.userPages[0].pageUrl.substring(
                                  0,
                                  data.userPages[0].pageUrl.indexOf('/') > 0
                                      ? data.userPages[0].pageUrl.indexOf('/')
                                      : data.userPages[0].pageUrl.length
                              )
                            : ''}
                    </div>
                    <div id="project-status" className="project-status" style={{ display: 'flex' }}>
                        {hasFinishedSetup ? (
                            <>
                                <div style={{ width: '25px', height: '25px' }}>
                                    <CheckLogo
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            fill: '#9966ff',
                                            borderRadius: '50%',
                                        }}
                                    />
                                </div>

                                <span>INSTALLATION COMPLETED</span>
                            </>
                        ) : (
                            <>
                                <div
                                    className="ring-container"
                                    style={{ marginTop: '10px', width: '25px', height: '25px' }}
                                >
                                    <div
                                        className="ringring"
                                        style={{ top: '0px', left: '0px' }}
                                    ></div>
                                    <div
                                        className="circle"
                                        style={{ top: '5px', left: '5px' }}
                                    ></div>
                                </div>
                                <span>INSTALLATION NOT COMPLETED</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="rs">
                    {!isEditor(userRole) && (
                        <Button
                            className="wf-btn-primary"
                            children={hasFinishedSetup ? 'ADD PAGE' : 'START NOW'}
                            onClick={async (e) => {
                                if (hasFinishedSetup) {
                                    setShowPopup(true);
                                } else {
                                    await updateOnboardingClient({ variables: { currentStep: 1 } });
                                    await updateUser({
                                        variables: { skippedOnboarding: false, isNew: true },
                                    });
                                    browserHistory.push('/onboarding');
                                }
                            }}
                        />
                    )}
                </div>
            </div>
            <div className="projects-page-sub-header">
                <div className="p-an-w">
                    <div className="p-an-l">Words</div>
                    <div className="p-an-v">{wordsCount > 0 ? wordsCount : '0'} </div>
                </div>

                <div className="p-an-w">
                    <div className="p-an-l">Pages</div>
                    <div className="p-an-v">{hasFinishedSetup ? data.userPages.length : '0'}</div>
                </div>

                <div className="p-an-w">
                    <div className="p-an-l">Strings</div>
                    <div className="p-an-v"> {stringCount > 0 ? stringCount : '0'} </div>
                </div>

                <div className="p-an-w">
                    <div className="p-an-l">Languages</div>
                    <div className="p-an-v">
                        {userLanguagesLoading
                            ? '0'
                            : userLanguagesData.userLanguages &&
                              userLanguagesData.userLanguages.length
                            ? userLanguagesData.userLanguages.length
                            : '0'}
                    </div>
                </div>

                <div className="p-an-w">
                    <div className="p-an-l">Translated</div>
                    <div className="p-an-v last">
                        {!isNaN(percentageTranslations) ? percentageTranslations : 0}%
                    </div>
                </div>
            </div>

            <div className="projects-page-table">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    onRow={(row) => {
                        return {
                            onClick: () => {
                                if (!isDeveloper(userRole)) {
                                    routerHistory.push(`/translation`, {
                                        pageId: row.pageId,
                                    });
                                } else {
                                    message.warn("You don't have permissions to access this page");
                                }
                            },
                        };
                    }}
                />
            </div>
            <div id="sidebar-id"></div>

            {showPopup && (
                <Popup
                    text="test"
                    component={() => {
                        return (
                            <SetupPopup
                                setShowPopup={setShowPopup}
                                apiKey={apiKey}
                                pagesCount={
                                    data.userPages && data.userPages.length
                                        ? data.userPages.length
                                        : 0
                                }
                            />
                        );
                    }}
                    closePopup={(e) => setShowPopup(false)}
                />
            )}
        </div>
    );
};

export default Projects;
