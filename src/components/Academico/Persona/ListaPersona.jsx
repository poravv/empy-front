//import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
//import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";
import { deletePersona, getPersona, updatePersona } from '../../../services/Persona';

let fechaActual = new Date();
const ListaPersona = ({ token }) => {
    
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    //---------------------------------------------------
    //Datos de buscador
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    //---------------------------------------------------
    useEffect(() => {
        getLstPersona();
        // eslint-disable-next-line
    }, []);

    const getLstPersona = async () => {
        let array = [];
        const res = await getPersona({token:token});
        //console.log(res.body)
        res.body.map((persona) => {
            persona.ciudad=persona.Ciudad.descripcion;
            array.push(persona);
            return true;
        })
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
        XLSX.utils.book_append_sheet(wb, ws, 'Personas');
        XLSX.writeFile(wb, 'Personas.xlsx')
    }

    const handleDelete = async (id) => {
        await deletePersona({token:token,param:id})
        getLstPersona();
    }

    const handleUpdate = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        
        await updatePersona({token:token,param:newData.idpersona,json:newData}) 
        getLstPersona();
    }
    /*Comentado por fuera de uso*/
    /*
    const getEdad = (dateString) => {
        let hoy = new Date()
        let fechaNacimiento = new Date(dateString)
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
        let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
        if (
          diferenciaMeses < 0 ||
          (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
        ) {
          edad--
        }
        return edad
      }
      */

    const columns = [
        {
            title: 'id',
            dataIndex: 'idpersona',
            width: '4%',
            editable: false,
            ...getColumnSearchProps('idpersona'),
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            //width: '10%',
            editable: true,
            ...getColumnSearchProps('nombre'),
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            //width: '10%',
            editable: true,
            ...getColumnSearchProps('apellido'),
        },
        {
            title: 'Documento',
            dataIndex: 'documento',
            //width: '10%',
            editable: true,
            ...getColumnSearchProps('documento'),
        },
        {
            title: 'Nacimiento',
            dataIndex: 'fnacimiento',
            //width: '10%',
            editable: true,
            ...getColumnSearchProps('fnacimiento'),
        }, 
        {
            title: 'Sexo',
            dataIndex: 'sexo',
            //width: '8%',
            editable: true,
            render: (_, { sexo, idpersona }) => {
                if(sexo){
                    let color = 'black';
                    if (sexo.toUpperCase() === 'MA') { color = 'blue' }
                    else { color = 'volcano'; }
                    return (
                        <Tag color={color} key={idpersona} >
                            {sexo.toUpperCase() === 'MA' ? 'Masculino' : 'Femenino'}
                        </Tag>
                    );
                }else{
                    return null;
                }
            },
        },
        {
            title: 'Doreccion',
            dataIndex: 'direccion',
            //width: '15%',
            editable: true,
            ...getColumnSearchProps('direccion'),
        }, 
        {
            title: 'Tipo documento',
            dataIndex: 'tipo_doc',
            //width: '22%',
            editable: false,
            ...getColumnSearchProps('tipo_doc'),
        }, 
        {
            title: 'Nacionalidad',
            dataIndex: 'nacionalidad',
            //width: '22%',
            editable: false,
            ...getColumnSearchProps('nacionalidad'),
        }, 
        {
            title: 'Correo',
            dataIndex: 'correo',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('correo'),
        }, 
        {
            title: 'Telefono',
            dataIndex: 'telefono',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('telefono'),
        },
        {
            title: 'Ciudad',
            dataIndex: 'ciudad',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('ciudad'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '7%',
            editable: true,
            render: (_, { estado, idpersona }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idpersona} >
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
                            onClick={() => save(record.idpersona)}
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
                            onConfirm={() => confirmDel(record.idpersona)}
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
        setEditingKey(record.idpersona);
    };


    const isEditing = (record) => record.idpersona === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idpersona) => {
        message.success('Procesando');
        handleDelete(idpersona);
    };

    const save = async (idpersona) => {


        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idpersona === item.idpersona);

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

    return (
        <>
            <h3>Lista de Personas</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearpersona')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idpersona'} varx={2500} />
        </>
    )
}

export default ListaPersona;
