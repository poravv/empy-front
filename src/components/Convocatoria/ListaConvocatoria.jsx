import { useState,useEffect, useRef
} from 'react';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { getConvocatoria,updateConvocatoria,anulaConvocatoria } from '../../services/Convocatoria';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

const ListaConvocatoria = ({ token }) => {
    
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        getLstConvocatoria();
        // eslint-disable-next-line
    }, []);

    const getLstConvocatoria = async () => {
        let array = [];
        const res = await getConvocatoria({ token: token, param: 'get' });
        //console.log(res.body)
        res.body.map((conv) => {
            conv.nombres=conv.planificacion.curso.descripcion;
            conv.desc_turno=conv.turno.descripcion;
            array.push(conv);
            return true;
        })
        //console.log(array)
        setData(array);
    }
    

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8, }} onKeyDown={(e) => e.stopPropagation()} >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }} />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }} >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }} >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }} >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => { close(); }} >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });



    const handleExport = () => {
        var wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Convocatorias');
        XLSX.writeFile(wb, 'Convocatorias.xlsx')
    }

    const delConvocatoria = async (id) => {
        //await deleteConvocatoria({token:token,param:id})
        await anulaConvocatoria({token:token,param:id,json:{estado:'AN'}})
        message.success('Registro anulado');
        getLstConvocatoria();
    }

    const updConvocatoria = async (newData) => {
        await updateConvocatoria({token:token,param:newData.idconvocatoria,json:newData}) 
        getLstConvocatoria();
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'idconvocatoria',
            width: '6%',
            editable: false,
            ...getColumnSearchProps('idconvocatoria'),
        },
        {
            title: 'Plan',
            dataIndex: 'nombres',
            width: '22%',
            editable: false,
            ...getColumnSearchProps('nombres'),
        },
        {
            title: 'Turno',
            dataIndex: 'desc_turno',
            width: '22%',
            editable: false,
            ...getColumnSearchProps('desc_turno'),
        },
        {
            title: 'cupo',
            dataIndex: 'cupo',
            editable: false,
            ...getColumnSearchProps('cupo'),
        },
        {
             title: 'Estado',
             dataIndex: 'estado',
             //width: '7%',
             editable: true,
             render: (_, { estado, idconvocatoria }) => {
                 let color = 'black';
                 if (estado.toUpperCase() === 'AC') { color = 'green' }
                 else { color = 'volcano'; }
                 return (
                     <Tag color={color} key={idconvocatoria} >
                         {estado.toUpperCase() === 'AC' ? 'Activo' : (estado.toUpperCase()==="AN") ? 'Anulado' : "Inactivo"}
                     </Tag>
                 );
             },
         },
        {
            title: 'Inscripcion',
            dataIndex: 'inscriptcion',
            render: (_, record) => {
                return (
                    <>
                   {record.estado==="AC"? <Button  onClick={() => navigate(`/crearinscripcion/${record.idconvocatoria}`)} >Inscribir</Button>: null}
                   {record.estado==='AC'? <Button style={{ marginLeft:`10px` }}  onClick={() => navigate(`/inscripcion/${record.idconvocatoria}`)} >Lista</Button> :null}
                    </>
                )
            },
        },
        {
            title: 'Accion',
            dataIndex: 'operacion',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.idconvocatoria)}
                            style={{
                                marginRight: 8,
                            }} >
                            Guardar
                        </Typography.Link>
                        <br />
                        <Popconfirm title="Desea cancelar?" onConfirm={cancel}>
                            <a href='/'>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>

                        <Typography.Link style={{ margin: `5px` }} disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Editar
                        </Typography.Link>

                        <Popconfirm
                            title="Desea anular este registro?"
                            onConfirm={() => confirmDel(record.idconvocatoria)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No" >
                            <Typography.Link >
                                Anular
                            </Typography.Link>
                        </Popconfirm>

                    </>
                );
            },
        }
    ];

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.idconvocatoria);
    };


    const isEditing = (record) => record.idconvocatoria === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idconvocatoria) => {
        delConvocatoria(idconvocatoria);
    };

    const save = async (idconvocatoria) => {
                try {
                    const row = await form.validateFields();
                    const newData = [...data];
                    const index = newData.findIndex((item) => idconvocatoria === item.idconvocatoria);
        
                    if (index > -1) {
        
                        const item = newData[index];
                        newData.splice(index, 1, {
                            ...item,
                            ...row,
                        });
                        //console.log(newData);
                        updConvocatoria(newData[index]);
                        setData(newData);
                        setEditingKey('');
        
                        message.success('Registro actualizado');
                    } else {
                        newData.push(row);
                        setData(newData);
                        setEditingKey('');
                    }
                } catch (errInfo) {
                    console.log('Validate Failed:', errInfo);
                }
    };



    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <h3>Convocatoria</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94Informatica5`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>

                <Button type="primary" onClick={() => navigate('/crearconvocatoria')} >{<PlusOutlined />} Convocatoria</Button>
            </div>
            <TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idconvocatoria'} varx={850} />
        </>
    )
}
export default ListaConvocatoria;

//<TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idconvocatoria'} />