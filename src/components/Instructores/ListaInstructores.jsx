//import axios from 'axios'
import { useState, 
    //useEffect, 
    useRef } from 'react'
//import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../TableModel/TableModel';
//import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

const data = [
{idinstructor:1,grado:'Cap',nombre:'Andres',apellido: 'Vera',edad:'32',sexo:'MA',materia:'FUNDAMENTOS DEL EMPLEO DEL PODER NAVAL'},
{idinstructor:2,grado:'Tte',nombre:'Alcides',apellido: 'Lopez',edad:'35',sexo:'MA',materia:'MATEMATICA'},
{idinstructor:3,grado:'Cap',nombre:'Raul',apellido: 'Ortega',edad:'29',sexo:'MA',materia:'EDUCACION FISICA'},
{idinstructor:4,grado:'Tte',nombre:'Arturo',apellido: 'Viera',edad:'32',sexo:'MA',materia:'FISICA AVANZADA'},
{idinstructor:5,grado:'Cap',nombre:'Enrique',apellido: 'Torres',edad:'27',sexo:'MA',materia:'FUNDAMENTOS DEL EMPLEO DEL PODER NAVAL'},
{idinstructor:6,grado:'Tte',nombre:'Salomon',apellido: 'Fernandez',edad:'28',sexo:'MA',materia:'MATEMATICA'},
{idinstructor:7,grado:'Cap',nombre:'Hugo',apellido: 'Perez',edad:'28',sexo:'MA',materia:'EDUCACION FISICA'},
{idinstructor:8,grado:'Tte',nombre:'Hector',apellido: 'Aguilar',edad:'27',sexo:'MA',materia:'FISICA AVANZADA'},
{idinstructor:9,grado:'Cap',nombre:'Cesar',apellido: 'Gavilan',edad:'33',sexo:'MA',materia:'FUNDAMENTOS DEL EMPLEO DEL PODER NAVAL'},
{idinstructor:10,grado:'Tte',nombre:'David',apellido: 'Vera',edad:'34',sexo:'MA',materia:'MATEMATICA'},
{idinstructor:11,grado:'Cap',nombre:'Francisco',apellido: 'Chavez',edad:'22',sexo:'MA',materia:'EDUCACION FISICA'},
{idinstructor:12,grado:'Tte',nombre:'Alejandro',apellido: 'Villasboa',edad:'34',sexo:'MA',materia:'FISICA AVANZADA'},
{idinstructor:13,grado:'Cap',nombre:'Isaias',apellido: 'Torres',edad:'28',sexo:'MA',materia:'FUNDAMENTOS DEL EMPLEO DEL PODER NAVAL'},
{idinstructor:14,grado:'Tte',nombre:'Raquel',apellido: 'Lovera',edad:'40',sexo:'FE',materia:'MATEMATICA'},
{idinstructor:15,grado:'Cap',nombre:'Angelica',apellido: 'Franco',edad:'42',sexo:'FE',materia:'EDUCACION FISICA'},
{idinstructor:16,grado:'Tte',nombre:'Luz',apellido: 'Almeida',edad:'29',sexo:'FE',materia:'FISICA AVANZADA'},
{idinstructor:17,grado:'Cap',nombre:'Aleli',apellido: 'Vera',edad:'32',sexo:'FE',materia:'FUNDAMENTOS DEL EMPLEO DEL PODER NAVAL'},
{idinstructor:18,grado:'Tte',nombre:'Claudia',apellido: 'Rotela',edad:'41',sexo:'FE',materia:'MATEMATICA'},
]

//const URI = 'http://186.158.152.141:3002/automot/api/contrato/';
//let fechaActual = new Date();
const ListaContrato = ({ token }) => {
    console.log('entra en contrato')
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
        getContrato();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getContrato = async () => {
        const res = await axios.get(`${URI}/get`, config)
        /*En caso de que de error en el server direcciona a login* /
        if (res.data.error) {
            Logout();
        }
        /*
        const resDataId = [];

        res.data.body.map((rs) => {
            rs.key = rs.idinstructor;
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
        XLSX.utils.book_append_sheet(wb, ws, 'Contratos');
        XLSX.writeFile(wb, 'Contratos.xlsx')
    }

    const deleteContrato = async (id) => {
        //await axios.delete(`${URI}/del/${id}`, config)
        //getContrato();
    }
// eslint-disable-next-line
    const updateContrato = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        
        /*
        await axios.put(URI + "put/" + newData.idinstructor, newData, config
        );
        getContrato();*/
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'idinstructor',
            width: '5%',
            editable: false,
            ...getColumnSearchProps('idinstructor'),
        },
        {
            title: 'Grado',
            dataIndex: 'grado',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('grado'),
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('nombre'),
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('apellido'),
        },
       /* {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            editable: true,
            render: (_, { estado, idinstructor }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idinstructor} >
                        {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                    </Tag>
                );
            },
        },*/
        {
            title: 'Edad',
            dataIndex: 'edad',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('edad'),
        },
        {
            title: 'Sexo',
            dataIndex: 'sexo',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('nombre'),
        },
        {
            title: 'Materia',
            dataIndex: 'materia',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('materia'),
        },
        {
            title: 'Accion',
            dataIndex: 'operacion',
            render: (_, record) => {

                const editable = isEditing(record);

                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.idinstructor)}
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
                            onConfirm={() => confirmDel(record.idinstructor)}
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
        setEditingKey(record.idinstructor);
    };


    const isEditing = (record) => record.idinstructor === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idinstructor) => {
        message.success('Procesando');
        deleteContrato(idinstructor);
    };

    const save = async (idinstructor) => {
/*

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idinstructor === item.idinstructor);

            if (index > -1) {

                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                newData[index].fecha_upd = strFecha;
                //console.log(newData);
                updateContrato(newData[index]);
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
            <h3>Instructores</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>

                <Button type="primary" onClick={() => navigate('/crearcontrato')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idinstructor'} />
        </>
    )
}

export default ListaContrato;
