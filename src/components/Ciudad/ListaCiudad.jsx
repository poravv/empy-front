//import axios from 'axios'
import { useState, 
    //useEffect,
    useRef } from 'react'
//import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

const data = [
    {idciudad:1,descripcion:'Capiata',estado:'AC'},
    {idciudad:2,descripcion:'Lambare',estado:'AC'},
    {idciudad:3,descripcion:'Luque',estado:'IN'},
    {idciudad:4,descripcion:'Itaugua',estado:'AC'},
    {idciudad:5,descripcion:'Asuncion',estado:'AC'},
    {idciudad:6,descripcion:'San Lorenzo',estado:'IN'},
    {idciudad:7,descripcion:'Prueba',estado:'AC'},
    {idciudad:8,descripcion:'Prueba',estado:'AC'},
    {idciudad:9,descripcion:'Prueba',estado:'AC'},
    {idciudad:10,descripcion:'Prueba',estado:'AC'},
    {idciudad:11,descripcion:'Prueba',estado:'AC'},
    {idciudad:12,descripcion:'Prueba',estado:'AC'},
]

//const URI = 'http://186.158.152.141:3002/automot/api/ciudad/';
//let fechaActual = new Date();
const ListaCiudad = ({ token }) => {
    console.log('entra en ciudad')
    const [form] = Form.useForm();
    //const [data, setData] = useState([]);

    const [editingKey, setEditingKey] = useState('');
    //const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    //---------------------------------------------------
    //Datos de buscador
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    //---------------------------------------------------

    /*
    useEffect(() => {
        getCiudad();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getCiudad = async () => {
        const res = await axios.get(`${URI}/get`, config)
        /*En caso de que de error en el server direcciona a login* /
        if (res.data.error) {
            Logout();
        }
        /*
        const resDataId = [];

        res.data.body.map((rs) => {
            rs.key = rs.idciudad;
            resDataId.push(rs);
            return true;
        })
        setData(resDataId);
        * /
        setData(res.data.body);
    }
    */

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
        XLSX.utils.book_append_sheet(wb, ws, 'Ciudades');
        XLSX.writeFile(wb, 'Ciudades.xlsx')
    }

    const deleteCiudad = async (id) => {
        //await axios.delete(`${URI}/del/${id}`, config)
        //getCiudad();
    }
// eslint-disable-next-line
    const updateCiudad = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        
        /*
        await axios.put(URI + "put/" + newData.idciudad, newData, config
        );
        getCiudad();*/
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'idciudad',
            width: '5%',
            editable: false,
            ...getColumnSearchProps('idciudad'),
        },
        {
            title: 'Descripcion',
            dataIndex: 'descripcion',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('descripcion'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            editable: true,
            render: (_, { estado, idciudad }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idciudad} >
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
                            onClick={() => save(record.idciudad)}
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
                            title="Desea eliminar este registro?"
                            onConfirm={() => confirmDel(record.idciudad)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No" >
                            <Typography.Link >
                                Borrar
                            </Typography.Link>
                        </Popconfirm>

                    </>
                );
            },
        }
    ]

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.idciudad);
    };


    const isEditing = (record) => record.idciudad === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idciudad) => {
        message.success('Procesando');
        deleteCiudad(idciudad);
    };

    const save = async (idciudad) => {
/*

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idciudad === item.idciudad);

            if (index > -1) {

                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                newData[index].fecha_upd = strFecha;
                //console.log(newData);
                updateCiudad(newData[index]);
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
        }*/
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
            <h3>Ciudades</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>

                <Button type="primary" onClick={() => navigate('/crearciudad')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idciudad'} />
        </>
    )
}
export default ListaCiudad