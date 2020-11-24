import React, { useContext, useState, useEffect, Children } from 'react';
import { Table, Input, Form, message, Popover } from 'antd';
import { parse, format } from 'date-fns';
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import GoBack from '../../../components/GoBack';
import { useGetPageQuery } from '../useQueries';
import Select, { components } from 'react-select';
import { useMeQuery } from '../../../rootUseQuery';
import Button from '../../../form/components/Button';
import {
    getPageWordsCount,
    getStringTranslation,
    getTranslationsPercentageByLanguage,
    mapLanguages,
} from '../utils';
import { useDeletePage, usePublishStringsMutation, useRefetchPage } from '../useMutations';
import { useUserLanguagesQuery } from '../../../user/useQueries';
import LoadingBar from 'react-top-loading-bar';
import { browserHistory } from '../../../browserHistory';
import { useCustomizerMutationClient } from '../../customizer/useMutations';
import { Redirect } from 'react-router-dom';

const EditableContext = React.createContext();

const CustomStyle = () => {
    return {
        option: (base, data) => {
            return {
                ...base,
                backgroundColor: 'white',
                color: '#0a2540',
                fontSize: '12px',
                letterSpacing: '0.43px',
                fontWeight: 'bold',
                '&:active': { backgroundColor: 'rgba(227, 232, 238, 0.42)' },
                '&:hover': { backgroundColor: '#e8eaef' },
            };
        },
        container: (base, { selectProps: { width, height } }) => ({
            ...base,
            width: '160px',
        }),
        indicatorSeparator: (base, state) => ({
            ...base,
            display: 'none',
        }),
        control: (base, state) => ({
            ...base,
            border: 'solid 1px rgba(227, 232, 238, 0.42)',
            borderRadius: '2px',
            boxShadow: 'none',
            '&:hover': { borderColor: '#a172ff' },
        }),
        singleValue: (base, state) => ({
            ...base,
            opacity: '1',
            fontFamily: 'Open Sans',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.43px',
        }),
    };
};

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();

    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const [focus, setFocus] = useState(false);

    const form = useContext(EditableContext);
    let childNode = children;

    if (editable) {
        let tbodyWrapper = document.getElementsByClassName('ant-table-tbody');

        if (record && (record[dataIndex] === null || record[dataIndex] === '')) {
            if (tbodyWrapper) {
                if (tbodyWrapper[0]) {
                    tbodyWrapper[0].children[record.key].children[0].style.borderLeft =
                        '2px solid #ff7166';
                }
            }
        } else {
            if (tbodyWrapper) {
                if (tbodyWrapper[0]) {
                    if (focus) {
                        tbodyWrapper[0].children[record.key].children[0].style.borderLeft =
                            '2px solid #9966ff';
                    } else
                        tbodyWrapper[0].children[record.key].children[0].style.borderLeft = 'none';
                }
            }
        }

        childNode = (
            <Input.TextArea
                value={record[dataIndex]}
                onChange={async (e) => {
                    handleSave({ ...record, ...{ translated: e.target.value } });
                }}
                cols="10"
                rows="3"
                onFocus={(e) => setFocus(true)}
                onBlur={(e) => setFocus(false)}
                style={{
                    border:
                        record[dataIndex] === null || record[dataIndex] === ''
                            ? '2px solid #ff7166'
                            : focus
                            ? '2px solid #9966ff'
                            : '2px solid rgba(227, 232, 238, 0.42)',

                    backgroundColor:
                        record[dataIndex] === null || record[dataIndex] === ''
                            ? 'rgba(255, 113, 102, 0.06)'
                            : focus
                            ? 'rgba(153, 102, 255, 0.13)'
                            : 'unset',
                }}
            />
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

const columns = (userLanguages, setSelectedLanguageId) => {
    let mappedLanguages = mapLanguages(userLanguages);
    const [updateCustomizerClient] = useCustomizerMutationClient();

    const Option = (props, index) => {
        let { options, value } = props;

        return options[options.length - 1].value === value ? (
            <>
                <components.Option {...props} />
                <div
                    style={{
                        fontFamily: 'Open Sans',
                        fontSize: '9px',
                        lineHeight: '5.22',
                        textAlign: 'center',
                    }}
                >
                    <Button
                        children="Add more"
                        className={'wf-btn-primary active'}
                        onClick={async (e) => {
                            await updateCustomizerClient({
                                variables: { isOpen: true, openLanguagesComponent: true },
                            });
                            browserHistory.push('/customizer');
                        }}
                        style={{
                            marginTop: '10px',
                            width: '101px',
                            lineHeight: '3.36',
                        }}
                    />
                </div>
            </>
        ) : (
            <components.Option {...props} />
        );
    };

    return [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            className: 'light-cells',
            shouldCellUpdate: () => true,
        },
        {
            title: 'ORIGINAL',
            dataIndex: 'original',
            key: 'original',
            width: '20%',
            className: 'light-cells',
        },
        {
            title: () => (
                <div>
                    <Select
                        options={mappedLanguages}
                        defaultValue={mappedLanguages[0]}
                        onChange={(e) => setSelectedLanguageId(e.value)}
                        styles={CustomStyle()}
                        isSearchable={false}
                        components={{ Option }}
                    />
                </div>
            ),
            dataIndex: 'translated',
            key: 'translated',
            editable: true,
            width: '20%',
        },
        {
            title: 'LAST EDIT',
            dataIndex: 'lastEdit',
            key: 'lastEdit',
            width: '15%',
            className: 'light-cells',
        },
    ];
};

const mapRows = (strings, selectedLanguageId) => {
    let rows = [];

    if (strings && strings.length) {
        strings.forEach((string, i) => {
            let row = {};

            const { translatedStringValue, updatedAtValue } = getStringTranslation(
                string,
                selectedLanguageId
            );

            row.key = i;
            row.id = string.id;
            row.original = string.original;
            row.translated = translatedStringValue;
            row.lastEdit = format(new Date(updatedAtValue).getTime(), 'd. MMM');
            row.stringId = string.id;
            row.selectedLanguageId = selectedLanguageId;
            rows.push(row);
        });
    }

    return rows;
};

const Translation = (props) => {
    let pageId;
    if (props.match && props.match.params) {
        pageId = parseInt(props.match.params.pageId);
    }
    const [progress, setProgress] = useState(0);
    const { data, loading, error } = useGetPageQuery(pageId);
    const { data: meData, loading: meLoading } = useMeQuery();
    const { data: userLanguagesData, loading: userLanguagesLoading } = useUserLanguagesQuery();

    const [publishTranslations] = usePublishStringsMutation();
    const [refetchPage] = useRefetchPage();
    const [deletePage] = useDeletePage();

    let [rowsData, setRowsData] = useState([]);
    let [userSelectedLang, setUserSelectedLang] = useState(0);
    let [dataUpdated, setDataUpdated] = useState(false);
    let [visible, setVisible] = useState(false);

    useEffect(() => {
        if (loading || meLoading || userLanguagesLoading) {
            setProgress(progress + 40);
        }

        return () => {
            setProgress(0);
        };
    }, []);
    if (loading || meLoading || userLanguagesLoading) {
        return (
            <LoadingBar
                color="#a172ff"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
        );
    }

    if (error) {
        message.warn('Unauthorized!');
        return <Redirect to="/" />;
    }
    const content = (
        <div
            style={{
                width: '180px',
                borderRadius: '2px',
                border: 'solid 1px #ccd2d8',
                backgroundColor: 'white',
                paddingLeft: '19px',
                paddingTop: '22px',
            }}
        >
            <div
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                    try {
                        setVisible(false);

                        message.success(
                            "Your page is being processed, please come back later when it's ready."
                        );
                        browserHistory.push('/');

                        const result = await refetchPage({ variables: { pageId } });
                        if (result && result.data && result.data.refetchPage) {
                        } else {
                            message.error('Unable to handle your request');
                        }
                    } catch (error) {
                        console.log(error);
                        message.error('Unable to handle your request');
                    }
                }}
            >
                <SyncOutlined style={{ width: '10px', height: '11px' }} />
                <span style={{ marginLeft: '16px' }}>Fetch again</span>
            </div>
            <div
                style={{ marginTop: '30px', marginBottom: '30px', cursor: 'pointer' }}
                onClick={async () => {
                    try {
                        setVisible(false);
                        const result = await deletePage({ variables: { pageId } });
                        if (result && result.data && result.data.deletePage) {
                            message.success('Your page is deleted successfully');
                            browserHistory.push('/');
                        } else {
                            message.error('Unable to handle your request');
                        }
                    } catch (error) {
                        console.log(error);
                        message.error('Unable to handle your request');
                    }
                }}
            >
                <DeleteOutlined style={{ width: '10px', height: '11px' }} />
                <span style={{ marginLeft: '16px' }}>Delete Page</span>
            </div>
        </div>
    );
    const pageData = data.getPage;
    let userLanguages =
        userLanguagesData && userLanguagesData.userLanguages ? userLanguagesData.userLanguages : [];

    const wordsCount = getPageWordsCount(data.getPage ? data.getPage.pageString : []);
    const percentageTranslated = getTranslationsPercentageByLanguage(
        data.getPage ? data.getPage.pageString : [],
        userSelectedLang,
        1
    );

    return (
        <div className="translation-page-wrapper">
            <div className="translation-page-header">
                <div className="ls">
                    <GoBack routerHistory={props.routerHistory} style={{ margin: '0px' }} />
                    <div className="translation-inner-title">URL</div>
                    <div className="translation-name">
                        <span style={{ color: '#c9ced4' }}>
                            {pageData.pageUrl.substring(0, pageData.pageUrl.indexOf('/'))}
                        </span>
                        <span>{pageData.pageUrl.substring(pageData.pageUrl.indexOf('/'))}</span>
                    </div>
                </div>
                <div className="rs">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {dataUpdated && (
                            <Button
                                // className="wf-btn-primary"
                                className={classNames('wf-btn-primary active')}
                                children={'Publish Changes'}
                                onClick={async (e) => {
                                    const updatedRows = rowsData
                                        .filter((row) => row.isUpdated && row.translated !== '')
                                        .map(({ translated, stringId, selectedLanguageId }) => {
                                            return { translated, stringId, selectedLanguageId };
                                        });
                                    if (updatedRows && updatedRows.length > 0) {
                                        const results = await publishTranslations({
                                            variables: { input: updatedRows },
                                        });
                                        if (
                                            results &&
                                            results.data &&
                                            results.data.addTranslations
                                        ) {
                                            message.success('Translations saved successfully!');
                                        } else {
                                            message.error(
                                                "Unable to save the translations, we've received the error, and we're working on it."
                                            );
                                        }
                                    }

                                    setDataUpdated(false);
                                }}
                            />
                        )}

                        <div className="page-popover">
                            <Popover
                                arrowContent="asd"
                                placement="bottomRight"
                                content={content}
                                trigger="click"
                                visible={visible}
                                onVisibleChange={(visible) => setVisible(visible)}
                            >
                                <Button className={visible ? 'active' : ''}>...</Button>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
            <div className="translation-page-sub-header">
                <div className="t-an-w">
                    <div className="t-an-l">Words</div>
                    <div className="t-an-v">{wordsCount > 0 ? wordsCount : '0'} </div>
                </div>

                <div className="t-an-w">
                    <div className="t-an-l">Strings</div>
                    <div className="t-an-v">
                        {data.getPage && data.getPage.pageString
                            ? data.getPage.pageString.length
                            : '0'}
                    </div>
                </div>

                <div className="t-an-w">
                    <div className="t-an-l">Translated</div>
                    <div className="t-an-v last">{percentageTranslated}%</div>
                </div>

                <div className="t-an-w">
                    <div className="t-an-l">Languages</div>
                    <div className="t-an-v">
                        {userLanguages && userLanguages.length ? userLanguages.length : '0'}
                    </div>
                </div>
            </div>

            <div className="translation-page-table">
                <TableWrapper
                    strings={data.getPage ? data.getPage.pageString : placeHolderRow}
                    userLanguages={userLanguages}
                    setRowsData={setRowsData}
                    setUserSelectedLang={setUserSelectedLang}
                    setDataUpdated={setDataUpdated}
                />
            </div>
        </div>
    );
};

const placeHolderRow = [
    {
        key: '1',
        id: '1',
        original: 'n. a.',
        translated: 'n. a.',
        lastEdit: 'n. a.',
    },
];

const TableWrapper = ({
    strings,
    userLanguages,
    setRowsData,
    setUserSelectedLang,
    setDataUpdated,
}) => {
    let [selectedLanguageId, setSelectedLanguageId] = useState(userLanguages[0].Language.id);
    let [rows, setRows] = useState(mapRows(strings, selectedLanguageId));

    let finalColumns = columns(userLanguages, setSelectedLanguageId).map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });

    useEffect(() => {
        setUserSelectedLang(selectedLanguageId);

        const mappedRows = mapRows(strings, selectedLanguageId);
        setRows(mappedRows);
        setRowsData(mappedRows);
    }, [selectedLanguageId]);

    const handleSave = (row) => {
        const newData = [...rows];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row, isUpdated: true });
        if (row.translated !== '') {
            setDataUpdated(true);
        } else {
            setDataUpdated(false);
        }
        setRows(newData);
        setRowsData(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    return (
        <Table
            id="translations-table"
            columns={finalColumns}
            dataSource={rows}
            pagination={false}
            components={components}
        />
    );
};
export default Translation;
