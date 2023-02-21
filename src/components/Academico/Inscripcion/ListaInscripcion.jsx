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
import { useParams } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";
import { /*deleteInscripcion,*/anulaInscripcion, getInscripcionConv, updateInscripcion } from '../../../services/Inscripcion';
import { getUniqueConvocatoria } from '../../../services/Convocatoria';


let fechaActual = new Date();
const ListaInscripcion = ({ token }) => {
    const { idconvocatoria } = useParams();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [convocatoria, setConvocatoria] = useState();
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
        getLstInscripcion(idconvocatoria);

        getConvocatoria(idconvocatoria);
        // eslint-disable-next-line
    }, []);

    const getConvocatoria = async (idconvocatoria) => {
        const res = await getUniqueConvocatoria({ token: token, param: idconvocatoria });
        //console.log(res.body)
        setConvocatoria(res.body);
    }

    const getLstInscripcion = async (idconvocatoria) => {
        let array = []
        const res = await getInscripcionConv({ token: token, param: idconvocatoria });

        res.body.map((inscripcion) => {
            inscripcion.nombre = inscripcion.persona.nombre;
            inscripcion.apellido = inscripcion.persona.apellido;
            inscripcion.sexo = inscripcion.persona.sexo;
            inscripcion.fnacimiento = inscripcion.persona.fnacimiento;
            inscripcion.telefono = inscripcion.persona.telefono;
            inscripcion.documento = inscripcion.persona.documento;
            array.push(inscripcion);
            return true;
        })

        setData(array);
        //console.log(res.body)
        //setData(res.body);
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
        XLSX.utils.book_append_sheet(wb, ws, 'Inscripcions');
        XLSX.writeFile(wb, 'Inscripcions.xlsx')
    }

    const handleDelete = async (id) => {
        //await deleteInscripcion({ token: token, param: id })
        await anulaInscripcion({ token: token, param: id,json:{estado:"AN"} })
        message.success('Procesando');
        getLstInscripcion();
    }

    const handleUpdate = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)

        await updateInscripcion({ token: token, param: newData.idinscripcion, json: newData })
        getLstInscripcion();
    }
    const getEdad = (dateString) => {
        let hoy = new Date()
        let fechaNacimiento = new Date(dateString)
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
        let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
        if (
            diferenciaMeses < 0 ||
            (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
        ){
            edad--
        }
            return edad
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'idinscripcion',
            width: '8%',
            editable: false,
            ...getColumnSearchProps('idinscripcion'),
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            //width: '22%',
            editable: false,
            ...getColumnSearchProps('nombre'),
            
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            //width: '22%',
            editable: false,
            ...getColumnSearchProps('apellido'),
        },
        {
            title: 'Documento',
            dataIndex: 'documento',
            //width: '22%',
            editable: false,
            ...getColumnSearchProps('documento'),
        },
        {
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
        },
        {
            title: 'Edad',
            dataIndex: 'edad',
            //width: '22%',
            editable: false,
            render: (_, { persona }) => {
                if (persona) {
                    return getEdad(persona.fnacimiento)

                } else {
                    return null;
                }
            }

        },
        {
            title: 'Sexo',
            dataIndex: 'sexo',
            //width: '22%',
            editable: false,
            render: (_, { persona, idinscripcion }) => {
                if (persona) {
                    let color = 'black';
                    if (persona.sexo.toUpperCase() === 'MA') { color = 'blue' }
                    else { color = 'volcano'; }
                    return (
                        <Tag color={color} key={idinscripcion} >
                            {persona.sexo.toUpperCase() === 'MA' ? 'Masculino' : 'Femenino'}
                        </Tag>
                    );
                } else {
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
                            title="Desea anular este registro?"
                            onConfirm={() => confirmDel(record.idinscripcion)}
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
        
        handleDelete(idinscripcion);
    };

    const save = async (idinscripcion) => {
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
        navigate('/convocatoria');
    }

    return (
        <>
            <h1>Lista de inscripcion </h1>


            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>

            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate(`/crearinscripcion/${idconvocatoria}`)} >{<PlusOutlined />}Nuevo</Button>
            </div>
            <h4 style={{ color: `#4AA3F3` }}>{convocatoria ? convocatoria.planificacion.curso.descripcion + ' Turno ' + convocatoria.turno.descripcion : null}</h4>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idinscripcion'} varx={1000} />

            <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                Atras
            </Button>
        </>
    )
}

export default ListaInscripcion;
