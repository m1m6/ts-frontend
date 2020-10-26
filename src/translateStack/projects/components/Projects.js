import { Table, Tag } from 'antd';
import React from 'react';
import { Rings } from 'svg-loaders-react';
import Button from '../../../form/components/Button';
import { useUserPagesQuery } from '../useQueries';
import { ReactComponent as CheckLogo } from '../../../assets/check.svg';
import { useMeQuery } from '../../../rootUseQuery';

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

            rows.push(row);
        });
    }
    return rows;
};

const Projects = () => {
    const { data, loading, error } = useUserPagesQuery();
    const { data: userData, loading: userLoading, error: userError } = useMeQuery();

    console.log('Projects', data);
    let dataSource = [];
    let hasFinishedSetup = false;

    if (loading) {
        dataSource = placeHolderRow;
    } else {
        if (data.userPages) {
            dataSource = mapRows(data.userPages);
            hasFinishedSetup = true;
        }
    }
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
                <Table columns={columns} dataSource={dataSource} pagination={false} />
            </div>
        </div>
    );
};

export default Projects;
