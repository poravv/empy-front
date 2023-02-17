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
import { deleteInstructor, getInstructor, updateInstructor } from '../../../services/Instructor';


let fechaActual = new Date();
const ListaInstructor = ({ token }) => {
    
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
        getLstInstructor();
        // eslint-disable-next-line
    }, []);

    const getLstInstructor = async () => {
        const res = await getInstructor({token:token});
        //console.log(res.body)
        setData(res.body);
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
        XLSX.utils.book_append_sheet(wb, ws, 'Instructors');
        XLSX.writeFile(wb, 'Instructors.xlsx')
    }

    const handleDelete = async (id) => {
        await deleteInstructor({token:token,param:id})
        getLstInstructor();
    }

    const handleUpdate = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        
        await updateInstructor({token:token,param:newData.idinstructor,json:newData}) 
        getLstInstructor();
    }
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
            editable: false,
            render: (_, { persona }) => {
                if(persona){
                    if(persona.grados_arma){
                        return persona.grados_arma.descripcion;
                    }else{
                        return null;
                    }
                }else{
                    return null;
                }
            }
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            //width: '22%',
            editable: false,
            render: (_, { persona }) => {
                if(persona){
                    return persona.nombre;
                }else{
                    return null;
                }
            }
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            //width: '22%',
            editable: false,
            render: (_, { persona }) => {
                if(persona){
                    return persona.apellido;
                }else{
                    return null;
                }
            }
        },
       {
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
        },
        {
            title: 'Edad',
            dataIndex: 'edad',
            //width: '22%',
            editable: false,
            render: (_, { persona }) => {
                if(persona){
                    return getEdad(persona.fnacimiento)
                    
                }else{
                    return null;
                }
            }
            
        },
        {
            title: 'Sexo',
            dataIndex: 'sexo',
            //width: '22%',
            editable: false,
            render: (_, { persona, idinstructor }) => {
                if(persona){
                    let color = 'black';
                    if (persona.sexo.toUpperCase() === 'MA') { color = 'blue' }
                    else { color = 'volcano'; }
                    return (
                        <Tag color={color} key={idinstructor} >
                            {persona.sexo.toUpperCase() === 'MA' ? 'Masculino' : 'Femenino'}
                        </Tag>
                    );
                }else{
                    return null;
                }
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
        handleDelete(idinstructor);
    };

    const save = async (idinstructor) => {


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
            <h3>Instructores</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearinstructor')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idinstructor'} />
        </>
    )
}

export default ListaInstructor;
