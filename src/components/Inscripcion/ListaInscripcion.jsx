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
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

const data = [
{idinscripcion:1,grado:'Cap',nombre:'Andres',apellido: 'Vera',curso:'Informatica',turno:'Mañana'},
{idinscripcion:2,grado:'Tte',nombre:'Alcides',apellido: 'Lopez',curso:'Matematica',turno:'Mañana'},
{idinscripcion:3,grado:'Cap',nombre:'Raul',apellido: 'Ortega',curso:'Fisica',turno:'Mañana'},
{idinscripcion:4,grado:'Tte',nombre:'Arturo',apellido: 'Viera',curso:'Informatica',turno:'Mañana'},
{idinscripcion:5,grado:'Cap',nombre:'Enrique',apellido: 'Torres',curso:'Informatica',turno:'Mañana'},
{idinscripcion:6,grado:'Tte',nombre:'Salomon',apellido: 'Fernandez',curso:'Fisica',turno:'Mañana'},
{idinscripcion:7,grado:'Cap',nombre:'Hugo',apellido: 'Perez',curso:'Matematica',turno:'Mañana'},
{idinscripcion:8,grado:'Tte',nombre:'Hector',apellido: 'Aguilar',curso:'Fisica',turno:'Mañana'},
{idinscripcion:9,grado:'Cap',nombre:'Cesar',apellido: 'Gavilan',curso:'Fisica',turno:'Mañana'},
{idinscripcion:10,grado:'Tte',nombre:'David',apellido: 'Vera',curso:'Matematica',turno:'Mañana'},
{idinscripcion:11,grado:'Cap',nombre:'Francisco',apellido: 'Chavez',curso:'Informatica',turno:'Mañana'},
{idinscripcion:12,grado:'Tte',nombre:'Alejandro',apellido: 'Villasboa',curso:'Informatica',turno:'Mañana'},
{idinscripcion:13,grado:'Cap',nombre:'Isaias',apellido: 'Torres',curso:'Fisica',turno:'Mañana'},
{idinscripcion:14,grado:'Tte',nombre:'Raquel',apellido: 'Lovera',curso:'Fisica',turno:'Tarde'},
{idinscripcion:15,grado:'Cap',nombre:'Angelica',apellido: 'Franco',curso:'Negocios',turno:'Tarde'},
{idinscripcion:16,grado:'Tte',nombre:'Luz',apellido: 'Almeida',curso:'Fisica',turno:'Tarde'},
{idinscripcion:17,grado:'Cap',nombre:'Aleli',apellido: 'Vera',curso:'Informatica',turno:'Tarde'},
{idinscripcion:18,grado:'Tte',nombre:'Claudia',apellido: 'Rotela',curso:'Negocios',turno:'Tarde'},
]

//const URI = 'http://186.158.152.141:3002/automot/api/inscripcion/';
//let fechaActual = new Date();
const ListaInscripcion = ({ token }) => {
    console.log('entra en inscripcion')
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
        getInscripcion();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getInscripcion = async () => {
        const res = await axios.get(`${URI}/get`, config)
        /*En caso de que de error en el server direcciona a login* /
        if (res.data.error) {
            Logout();
        }
        /*
        const resDataId = [];

        res.data.body.map((rs) => {
            rs.key = rs.idinscripcion;
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
        XLSX.utils.book_append_sheet(wb, ws, 'Inscripcions');
        XLSX.writeFile(wb, 'Inscripcions.xlsx')
    }

    const deleteInscripcion = async (id) => {
        //await axios.delete(`${URI}/del/${id}`, config)
        //getInscripcion();
    }
// eslint-disable-next-line
    const updateInscripcion = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        
        /*
        await axios.put(URI + "put/" + newData.idinscripcion, newData, config
        );
        getInscripcion();*/
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'idinscripcion',
            width: '5%',
            editable: false,
            ...getColumnSearchProps('idinscripcion'),
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
            render: (_, { estado, idinscripcion }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idinscripcion} >
                        {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                    </Tag>
                );
            },
        },*/
        {
            title: 'Gestion',
            dataIndex: 'gestion',
            render: (_, record) => {
                return (
                    <>
                   <Button style={{ marginLeft:`10px` }}  onClick={() => navigate(`/faltas/${record.idconvocatoria}`)} >Faltas</Button> 
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
                            onClick={() => save(record.idinscripcion)}
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
                            onConfirm={() => confirmDel(record.idinscripcion)}
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
        setEditingKey(record.idinscripcion);
    };


    const isEditing = (record) => record.idinscripcion === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idinscripcion) => {
        message.success('Procesando');
        deleteInscripcion(idinscripcion);
    };

    const save = async (idinscripcion) => {
/*

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idinscripcion === item.idinscripcion);

            if (index > -1) {

                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                newData[index].fecha_upd = strFecha;
                //console.log(newData);
                updateInscripcion(newData[index]);
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
            <h3>Lista estudiantes</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94Informatica5`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idinscripcion'} />
        </>
    )
}
export default ListaInscripcion

/*
<div style={{ marginBottom: `5px`, textAlign: `end` }}>

                <Button type="primary" onClick={() => navigate('/crearinscripcion')} >{<PlusOutlined />} Nuevo</Button>
            </div>
*/