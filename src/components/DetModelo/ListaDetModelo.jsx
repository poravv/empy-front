import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
//import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space, Image } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

import { Buffer } from 'buffer'

const URI = 'http://186.158.152.141:3002/automot/api/detmodelo';
let fechaActual = new Date();
const ListaDetModelo = ({ token,idsucursal }) => {

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
        getModelo();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getModelo = async () => {
        const res = await axios.get(`${URI}/getsucursal/${idsucursal}`, config)
        console.log(res.data.body);
        setData(res.data.body);

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
        XLSX.utils.book_append_sheet(wb, ws, 'Vehiculos');
        XLSX.writeFile(wb, 'Vehiculos.xlsx')
    }

    const deleteModelo = async (id) => {
        await axios.delete(`${URI}/del/${id}`, config)
        getModelo();
    }

    const updateModelo = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        await axios.put(URI + "/put/" + newData.idmodelo, newData, config
        );
        getModelo();
    }


    const columns = [
        {
            title: 'id',
            dataIndex: 'iddet_modelo',
            //width: '5%',
            editable: false,
            ...getColumnSearchProps('iddetmodelo'),
        },
        {
            title: 'Modelo',
            dataIndex: 'idmodelo',
            //width: '12%',
            editable: true,
            render: (_, { modelo }) => {
                return (
                    modelo.descripcion
                );
            },
        },
        {
            title: 'Marca',
            dataIndex: 'idmarca',
            //width: '15%',
            editable: true,
            render: (_, { marca }) => {
                return (
                    marca.descripcion
                );
            },
            //...getColumnSearchProps('proveedor'),
        },
        {
            title: 'Detalle',
            dataIndex: 'detalle',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('descripcion'),
        },
        {
            title: 'Costo',
            dataIndex: 'costo',
            //width: '12%',
            editable: true,
        },
        {
            title: 'Chasis',
            dataIndex: 'chasis',
            //width: '12%',
            editable: true,
        },
        {
            title: 'Año',
            dataIndex: 'anho',
            //width: '12%',
            editable: true,
        },
        {
            title: 'Matricula',
            dataIndex: 'matricula',
            //width: '12%',
            editable: true,
        },
        {
            title: 'Color',
            dataIndex: 'color',
            //width: '12%',
            editable: true,
        },
        {
            title: 'Imagen',
            dataIndex: 'img',
            //width: '8%',
            editable: true,
            render: (_, { img }) => {
                if (img && typeof img !== "string") {
                    //console.log(typeof img);
                    const asciiTraducido = Buffer.from(img.data).toString('ascii');
                    //console.log(asciiTraducido);
                    if (asciiTraducido) {
                        return (
                            <Image
                                style={{ border: `1px solid gray`, borderRadius: `4px` }}
                                alt="imagen"
                                //preview={false}
                                //style={{ width: '50%',margin:`0px`,textAlign:`center` }}
                                src={asciiTraducido}
                            />
                        );
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            },
        },
        {
            title: 'Imagen',
            dataIndex: 'img1',
            //width: '8%',
            editable: true,
            render: (_, { img1 }) => {
                if (img1 && typeof img1 !== "string") {
                    //console.log(typeof img);
                    const asciiTraducido = Buffer.from(img1.data).toString('ascii');
                    //console.log(asciiTraducido);
                    if (asciiTraducido) {
                        return (
                            <Image
                                style={{ border: `1px solid gray`, borderRadius: `4px` }}
                                alt="imagen"
                                //preview={false}
                                //style={{ width: '50%',margin:`0px`,textAlign:`center` }}
                                src={asciiTraducido}
                            />
                        );
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            },
        },
        {
            title: 'Imagen',
            dataIndex: 'img2',
            //width: '8%',
            editable: true,
            render: (_, { img2 }) => {
                if (img2 && typeof img2 !== "string") {
                    //console.log(typeof img);
                    const asciiTraducido = Buffer.from(img2.data).toString('ascii');
                    //console.log(asciiTraducido);
                    if (asciiTraducido) {
                        return (
                            <Image
                                style={{ border: `1px solid gray`, borderRadius: `4px` }}
                                alt="imagen"
                                //preview={false}
                                //style={{ width: '50%',margin:`0px`,textAlign:`center` }}
                                src={asciiTraducido}
                            />
                        );
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            },
        },
        {
            title: 'Proveedor',
            dataIndex: 'idproveedor',
            //width: '15%',
            editable: true,
            render: (_, { proveedor }) => {
                return (
                    proveedor.razon_social
                );
            },
            //...getColumnSearchProps('proveedor'),
        },
        {
            title: 'Ruc proveedor',
            dataIndex: 'ruc',
            //width: '12%',
            editable: false,
            render: (_, { proveedor }) => {
                return (
                    proveedor.ruc
                );
            },
            //...getColumnSearchProps('proveedor'),
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '10%',
            editable: true,
            render: (_, { estado, idmodelo }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idmodelo} >
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
                            onClick={() => save(record.idmodelo, record)}
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
                            onConfirm={() => confirmDel(record.idmodelo)}
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
        setEditingKey(record.idmodelo);
    };


    const isEditing = (record) => record.idmodelo === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idmodelo) => {
        message.success('Procesando');
        deleteModelo(idmodelo);
    };

    const save = async (idmodelo, record) => {

        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idmodelo === item.idmodelo);

            if (index > -1) {
                const item = newData[index];
                //console.log(newData);

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                if (record.idmodelo === item.idmodelo) {
                    //console.log('Entra en asignacion',record.img);
                    newData[index].img = record.img;
                    newData[index].img1 = record.img1;
                    newData[index].img2 = record.img2;
                }

                newData[index].fecha_upd = strFecha;

                //console.log(newData);

                updateModelo(newData[index]);
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
            <h3>Playa disponible</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button className='success' onClick={() => navigate('/detmodelototal')} >Total</Button>
            </div>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/creardetmodelo')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idmodelo'} />
        </>
    )
}
export default ListaDetModelo