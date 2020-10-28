import { message, Skeleton, Table, Tag } from 'antd';
import React, { useState } from 'react';
import { Rings } from 'svg-loaders-react';
import Button from '../../../form/components/Button';
import { useUserPagesQuery } from '../useQueries';
import { ReactComponent as CheckLogo } from '../../../assets/check.svg';
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

const SetupPopup = ({ setShowPopup }) => {
    let [pageUrl, setPageUrl] = useState(undefined);
    let [isSubmitting, setIsSubmitting] = useState(false);
    const [useAddSinglePage] = useAddSinglePageMutation();
    return (
        <div className="setup-popup-wrapper">
            <div className="setup-p-title">Set up</div>
            <div className="setup-p-description">
                Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                Journals und Research Paper stützt. Verwende dafür fundierte Quellen und Online
                Bibliotheken, die wir dir unten aufgeführt haben.
            </div>
            <div className="setup-p-code">
                <div className="setup-code">
                    <Button children="COPY" onClick={(e) => copyToClipboard('code-snippet')} />
                    <SyntaxHighlighter language="javascript" style={dark} id="code-snippet">
                        {`
    <script type="text/javascript">
        var tsstack = function () {
            var tss = document.createElement('script'); tss.type = 'text/javascript'; tss.async = true;
            tss.src = 'http://localhost:5500/index.js?apiKey=d037c40228044607871b72909c2ccb74';
            tss.id = "tss-script";
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(tss);
        }
        window.onload = tsstack
    </script>`}
                    </SyntaxHighlighter>
                </div>
            </div>
            <div className="setup-p-d-w">
                <div className="setup-p-d-t">Choose your page</div>
                <div className="setup-p-d-d">
                    Es ist essentiell, dass du deine Bachelorarbeit auf etablierte internationale
                    Journals und Research Paper stützt. Verwend
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
                    <Button
                        className="wf-btn-primary"
                        children="TEST SETUP"
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
                                    message.warn('Unable to verify the page!');
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

const mapRows = (pages) => {
    let rows = [];

    if (pages && pages.length) {
        pages.forEach((page, i) => {
            let row = {};

            row.key = i;
            row.url = page.pageUrl;
            row.strings = page.strings.length;
            row.translated = `10%`;
            row.lastEdit = page.updatedAt;
            row.pageId = page.id;

            rows.push(row);
        });
    }
    return rows;
};

const Projects = ({ routerHistory }) => {
    const [showPopup, setShowPopup] = useState(false);

    const { data, loading, error } = useUserPagesQuery();
    const { data: userData, loading: userLoading, error: userError } = useMeQuery();
    const [updateUser] = useUpdateUserMutation();
    const [updateOnboardingClient] = useOnboardingMutationClient();

    let dataSource = placeHolderRow;

    if (loading || userLoading) {
        return '';
    } else {
        if (data && data.userPages) {
            dataSource = mapRows(data.userPages);
        }
    }

    let hasFinishedSetup = userData && userData.me ? !userData.me.isNew : false;

    return (
        <div className="projects-page-wrapper">
            <div className="projects-page-header">
                <div className="ls">
                    <div className="projects-inner-title">Project</div>
                    <div className="project-name">
                        {hasFinishedSetup
                            ? data.userPages[0].pageUrl.substring(
                                  0,
                                  data.userPages[0].pageUrl.indexOf('/')
                              )
                            : 'n.a.'}
                    </div>
                    <div className="project-status">
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
                    <div className="p-an-v">n.a. </div>
                </div>

                <div className="p-an-w">
                    <div className="p-an-l">Pages</div>
                    <div className="p-an-v">
                        {hasFinishedSetup ? data.userPages.length : 'n.a.'}
                    </div>
                </div>

                <div className="p-an-w">
                    <div className="p-an-l">Strings</div>
                    <div className="p-an-v">n.a. </div>
                </div>

                <div className="p-an-w">
                    <div className="p-an-l">Languages</div>
                    <div className="p-an-v">
                        {userLoading
                            ? 'n.a.'
                            : userData.me && userData.me.languages && userData.me.languages.length
                            ? userData.me.languages.length
                            : 'n.a.'}
                    </div>
                </div>

                <div className="p-an-w">
                    <div className="p-an-l">Translated</div>
                    <div className="p-an-v last">95%</div>
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

            {showPopup && (
                <Popup
                    text="test"
                    component={() => {
                        return <SetupPopup setShowPopup={setShowPopup} />;
                    }}
                    closePopup={(e) => setShowPopup(false)}
                />
            )}
        </div>
    );
};

export default Projects;
