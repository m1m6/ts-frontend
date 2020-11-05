import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Form, message } from 'antd';
import GoBack from '../../../components/GoBack';
import { useGetPageQuery } from '../useQueries';
import Select from 'react-select';
import { useMeQuery } from '../../../rootUseQuery';
import Button from '../../../form/components/Button';
import {
    getPageWordsCount,
    getStringTranslation,
    getTranslationsPercentageByLanguage,
    mapLanguages,
} from '../utils';
import { usePublishStringsMutation } from '../useMutations';

const EditableContext = React.createContext();

const CustomStyle = () => {
    return {
        option: (base, data) => {
            return {
                ...base,
                backgroundColor: '#e8eaef',
                color: '#0a2540',
                fontSize: '12px',
                letterSpacing: '0.43px',
                fontWeight: 'bold',
                '&:active': { backgroundColor: 'rgba(227, 232, 238, 0.42)' },
            };
        },
        container: (base, { selectProps: { width, height } }) => ({
            ...base,
            width: '40%',
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
            opacity: '0.29',
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

    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async (e) => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        validator: (_, value) => {
                            let tbodyWrapper = document.getElementsByClassName('ant-table-tbody');

                            if (value) {
                                if (tbodyWrapper) {
                                    if (tbodyWrapper[0]) {
                                        tbodyWrapper[0].children[
                                            record.key
                                        ].children[0].style.borderLeft = 'none';
                                    }
                                }
                                return Promise.resolve();
                            } else {
                                if (tbodyWrapper) {
                                    if (tbodyWrapper[0]) {
                                        tbodyWrapper[0].children[
                                            record.key
                                        ].children[0].style.borderLeft = '2px solid red';
                                    }
                                }
                                return Promise.reject();
                            }
                        },
                    },
                ]}
            >
                <Input.TextArea
                    cols="10"
                    rows="3"
                    ref={inputRef}
                    onPressEnter={save}
                    onBlur={save}
                    className="translated-string-input"
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

const columns = (userLanguages, setSelectedLanguageId) => {
    const mappedLanguages = mapLanguages(userLanguages);

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
            row.lastEdit = updatedAtValue;
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

    const { data, loading, error } = useGetPageQuery(pageId);
    const { data: meData, loading: meLoading } = useMeQuery();
    const [publishTranslations] = usePublishStringsMutation();

    let [rowsData, setRowsData] = useState([]);
    let [userSelectedLang, setUserSelectedLang] = useState(0);

    if (loading || meLoading) {
        return <></>;
    }

    const pageData = data.getPage;
    const userLanguages = meData && meData.me ? meData.me.languages : [];
    const wordsCount = getPageWordsCount(data.getPage ? data.getPage.pageString : []);
    const percentageTranslated = getTranslationsPercentageByLanguage(
        data.getPage ? data.getPage.pageString : [],
        userSelectedLang
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
                    <Button
                        className="wf-btn-primary"
                        children={'Publish Changes'}
                        onClick={async (e) => {
                            // get all updated strings only
                            const updatedRows = rowsData
                                .filter((row) => row.isUpdated && row.translated !== 'n.a.')
                                .map(({ translated, stringId, selectedLanguageId }) => {
                                    return { translated, stringId, selectedLanguageId };
                                });
                            if (updatedRows && updatedRows.length > 0) {
                                const results = await publishTranslations({
                                    variables: { input: updatedRows },
                                });
                                if (results && results.data && results.data.addTranslations) {
                                    message.success('Translations saved successfully!');
                                } else {
                                    message.error(
                                        "Unable to save the translations, we've received the error, and we're working on it."
                                    );
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <div className="translation-page-sub-header">
                <div className="t-an-w">
                    <div className="t-an-l">Words</div>
                    <div className="t-an-v">{wordsCount > 0 ? wordsCount : 'n.a.'} </div>
                </div>

                <div className="t-an-w">
                    <div className="t-an-l">Strings</div>
                    <div className="t-an-v">
                        {data.getPage && data.getPage.pageString
                            ? data.getPage.pageString.length
                            : 'n.a.'}
                    </div>
                </div>

                <div className="t-an-w">
                    <div className="t-an-l">Translated</div>
                    <div className="t-an-v last">{percentageTranslated}%</div>
                </div>

                <div className="t-an-w">
                    <div className="t-an-l">Languages</div>
                    <div className="t-an-v">
                        {userLanguages && userLanguages.length ? userLanguages.length : 'n.a.'}
                    </div>
                </div>
            </div>

            <div className="translation-page-table">
                <TableWrapper
                    strings={data.getPage ? data.getPage.pageString : placeHolderRow}
                    userLanguages={userLanguages}
                    setRowsData={setRowsData}
                    setUserSelectedLang={setUserSelectedLang}
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

const TableWrapper = ({ strings, userLanguages, setRowsData, setUserSelectedLang }) => {
    let [selectedLanguageId, setSelectedLanguageId] = useState(userLanguages[0].Language.id);
    let [rows, setRows] = useState(mapRows(strings, selectedLanguageId));

    useEffect(() => {
        const mappedRows = mapRows(strings, selectedLanguageId)
        console.log("mappedRows", mappedRows);
        setRows(mappedRows);
        setRowsData(mappedRows);
        setUserSelectedLang(selectedLanguageId);
    }, [selectedLanguageId]);

    const handleSave = (row) => {
        const newData = [...rows];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row, isUpdated: true });
        setRows(newData);
        setRowsData(newData);
    };

    const finalColumns = columns(userLanguages, setSelectedLanguageId).map((col) => {
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
