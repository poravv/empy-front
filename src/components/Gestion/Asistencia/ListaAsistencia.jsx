//import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";
import { getAsistenciaId,deleteAsistencia, updateAsistencia } from '../../../services/Asistencia';

const ListaAsistencia = ({ token }) => {
    const { iddet_planificacion } = useParams();
    //console.log(iddet_planificacion)
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    let fechaActual = new Date();
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [editingKey, setEditingKey] = useState('');
    //Datos de buscador
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        getLstAsistencia();
        // eslint-disable-next-line
    }, []);
    
    const getLstAsistencia = async () => {
        try{
            const res = await getAsistenciaId({token:token,param:iddet_planificacion});
            setData(res.body);
        }catch(e){
            console.log(e);
        }
        //console.log(res.body)
        /*En caso de que de error en el server direcciona a login*/
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
        XLSX.utils.book_append_sheet(wb, ws, 'Asistencias');
        XLSX.writeFile(wb, 'Asistencias.xlsx')
    }

    const handleDelete = async (id) => {
        await deleteAsistencia({token:token,param:id})
        getLstAsistencia();
    }
// eslint-disable-next-line
    const handleUpdate = async (newData) => {
        //console.log(newData)
        await updateAsistencia({token:token,param:newData.idasistencia,json:newData}) 
        getLstAsistencia();
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'idasistencia',
            width: '12%',
            editable: false,
            //...getColumnSearchProps('idasistencia'),
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('fecha'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            editable: true,
            render: (_, { estado, idasistencia }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idasistencia} >
                        {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                    </Tag>
                );
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
                            onClick={() => save(record.idasistencia)}
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
                        <Popconfirm
                            title="Desea eliminar este registro?"
                            onConfirm={() => confirmDel(record.idasistencia)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No" >
                        <Button style={{ marginLeft:`5px` }}>Borrar</Button>
                        </Popconfirm>
                        <Button style={{ marginLeft:`5px` }} onClick={() => navigate(`/asistenciadetalle/${record.idasistencia}`)} >Detalle</Button>
                    </>
                );
            },
        }
    ]

    const isEditing = (record) => record.idasistencia === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idasistencia) => {
        message.success('Procesando');
        handleDelete(idasistencia);
    };

    const save = async (idasistencia) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idasistencia === item.idasistencia);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                newData[index].fecha_upd = strFecha;
                //console.log(newData);
                handleUpdate(newData[index]);
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

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/gestion');
    }

    return (
        <>
            <h3>Asistencias</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate(`/crearasistencia/${iddet_planificacion}`)} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idasistencia'} />
            <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                Atras
            </Button>
        </>
    )
}
export default ListaAsistencia