import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import GoBack from '../../../components/GoBack';
import { useGetPageQuery } from '../useQueries';
import Select from 'react-select';
import { useMeQuery } from '../../../rootUseQuery';

const EditableContext = React.createContext();

const CustomStyle = () => {
    return {
        // option: (base, data) => {
        //     return { ...base };
        // },
        // menu: (provided, state) => ({
        //     ...provided,
        //     width: state.selectProps.width,
        //     borderBottom: '1px dotted pink',
        //     color: state.selectProps.menuColor,
        //     padding: 20,
        // }),
        container: (base, { selectProps: { width, height } }) => ({
            ...base,
            width: '40%',
            // marginTop: '33px',
            // minHeight: '83px',
            // height: '83px',
        }),
        control: (base, state) => ({
            ...base,
            border: 'solid 1px rgba(227, 232, 238, 0.42)',
            borderRadius: '2px',
        }),
        // indicatorSeparator: (base, state) => ({
        //     ...base,
        //     display: 'none',
        // }),
        // multiValue: (base, state) => ({
        //     ...base,
        //     height: '47px',
        //     borderRadius: '3px',
        //     border: 'solid 1px rgba(227, 232, 238, 0.42)',
        //     backgroundColor: 'rgba(227, 232, 238, 0.42)',
        //     paddingLeft: '13px',
        //     paddingTop: '10px',
        //     paddingBottom: '8px',
        // }),
    };
};

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form} >
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
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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

const mapLanguages = (languagesList) => {
    return languagesList.map(({ Languages }) => ({
        label: (
            <div
                style={{
                    fontSize: '14px',
                    color: '#0a2540',
                    marginRight: '25px',
                }}
            >
                <img
                    src={Languages.flag}
                    style={{ width: '23px', height: '23px', borderRadius: '50px' }}
                />
                <span style={{ marginLeft: '13px' }}>{Languages.language}</span>
            </div>
        ),
        value: Languages.id,
    }));
};

const columns = (userLanguages) => {
    const mappedLanguages = mapLanguages(userLanguages);

    return [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            className: "light-cells"
        },
        {
            title: 'ORIGINAL',
            dataIndex: 'original',
            key: 'original',
            width: '20%',
            className: "light-cells"

        },
        {
            title: () => (
                <div>
                    <Select
                        options={mappedLanguages}
                        defaultValue={mappedLanguages[0]}
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
            className: "light-cells"

        },
    ];
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

const mapRows = (strings) => {
    let rows = [];

    if (strings && strings.length) {
        strings.forEach((string, i) => {
            let row = {};

            row.key = i;
            row.id = string.id;
            row.original = string.original;
            row.translated = `10%`;
            row.lastEdit = string.updatedAt;
            row.stringId = string.id;

            rows.push(row);
        });
    }
    return rows;
};

const Translation = (props) => {
    let dataSource = placeHolderRow;

    let pageId;
    if (props.match && props.match.params) {
        pageId = parseInt(props.match.params.pageId);
    }

    const { data, loading, error } = useGetPageQuery(pageId);
    const { data: meData, loading: meLoading } = useMeQuery();

    console.log('Translation', data, error, loading);

    if (loading || meLoading) {
        return <></>;
    }

    const pageData = data.getPage;
    const userLanguages = meData && meData.me ? meData.me.languages : [];

    dataSource = mapRows(pageData.strings);

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const finalColumns = columns(userLanguages).map((col) => {
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
                handleSave: () => console.log('editted'),
            }),
        };
    });
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
            </div>
            <div className="translation-page-sub-header">
                <div className="t-an-w">
                    <div className="t-an-l">Words</div>
                    <div className="t-an-v">n.a. </div>
                </div>

                <div className="t-an-w">
                    <div className="t-an-l">Strings</div>
                    <div className="t-an-v">n.a. </div>
                </div>

                <div className="t-an-w">
                    <div className="t-an-l">Translated</div>
                    <div className="t-an-v last">95%</div>
                </div>

                <div className="t-an-w">
                    <div className="t-an-l">Languages</div>
                    <div className="t-an-v">n.a.</div>
                </div>
            </div>

            <div className="translation-page-table">
                <Table
                    columns={finalColumns}
                    dataSource={dataSource}
                    pagination={false}
                    components={components}
                />
            </div>
        </div>
    );
};

export default Translation;
