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
import { useUserLanguagesQuery } from '../../../user/useQueries';
import { OnboardinButton } from '../../onboarding/components/Onboarding';

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

const SetupPopup = ({ setShowPopup, apiKey }) => {
    let [pageUrl, setPageUrl] = useState(undefined);
    let [isSubmitting, setIsSubmitting] = useState(false);
    const [useAddSinglePage] = useAddSinglePageMutation();
    return (
        <div className="setup-popup-wrapper">
            <div className="setup-p-title">Add another page</div>
            <div className="setup-p-description">
                Copy your code snippet below and place it in the &#60;head&#62; of your page.
                Afterwards, enter the URL to test your integration.
            </div>
            <div className="setup-p-code">
                <div className="setup-code">
                    <Button children="COPY" onClick={(e) => copyToClipboard('code-snippet')} />
                    <SyntaxHighlighter language="javascript" style={dark} id="code-snippet">
                        {`
    <script type="text/javascript">
        var tsstack = function () {
            var tss = document.createElement('script'); tss.type = 'text/javascript'; tss.async = true;
            tss.src = 'https://app.translatestack.com/sdk/sdk.js?apiKey=${apiKey}';
            tss.id = "tss-script";
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(tss);
        }
        window.onload = tsstack
    </script>`}
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
                            setIsSubmitting(true);
                            if (pageUrl && /^(http|https):\/\/[^ "]+$/.test(pageUrl)) {
                                const results = await useAddSinglePage({
                                    variables: { pageUrl },
                                });

                                if (results && results.data && results.data.addSinglePage) {
                                    message.success('Page successfully added');
                                    setShowPopup(false);
                                } else {
                                    message.warn('Unable to verify the page');
                                }
                            } else {
                                message.error('Please enter a valid page url');
                            }

                            setIsSubmitting(false);
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
                            <Rings
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    background: '#9966ff',
                                    borderRadius: '50%',
                                }}
                            />
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
                    <div id="project-status" className="project-status">
                        {hasFinishedSetup ? (
                            <>
                                <CheckLogo
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        fill: '#9966ff',
                                        borderRadius: '50%',
                                    }}
                                />
                                INSTALLATION COMPLETED
                            </>
                        ) : (
                            <>
                                <Rings
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        background: '#9966ff',
                                        borderRadius: '50%',
                                    }}
                                />
                                INSTALLATION NOT COMPLETED
                            </>
                        )}
                    </div>
                </div>
                <div className="rs">
                    <Button
                        className="wf-btn-primary"
                        children={hasFinishedSetup ? 'ADD PAGE' : 'START NOW'}
                        onClick={async (e) => {
                            if (hasFinishedSetup) {
                                setShowPopup(true);
                            } else {
                                await updateOnboardingClient({ variables: { currentStep: 1 } });
                                await updateUser({ variables: { skippedOnboarding: false } });
                                browserHistory.push('/onboarding');
                            }
                        }}
                    />
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
                            onClick: () => routerHistory.push(`/translation/${row.pageId}`),
                        };
                    }}
                />
            </div>
            <div id="sidebar-id"></div>

            {showPopup && (
                <Popup
                    text="test"
                    component={() => {
                        return <SetupPopup setShowPopup={setShowPopup} apiKey={apiKey} />;
                    }}
                    closePopup={(e) => setShowPopup(false)}
                />
            )}
        </div>
    );
};

export default Projects;
