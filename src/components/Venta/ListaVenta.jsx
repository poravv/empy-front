import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
//import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModelExpand from '../TableModel/TableModelExpand';
import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

const URI = 'http://186.158.152.141:4000/automot/api/venta';
let fechaActual = new Date();
const ListaVenta = ({ token,idusuario }) => {

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
        getVentas();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };


    const getVentas = async () => {
        const res = await axios.get(`${URI}/getvenusu/${idusuario}`, config)
        /*En caso de que de error en el server direcciona a login*/
        //console.log(res.data.body);

        //if (res.data.error) {Logout();}
        
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


    const deleteVenta = async (idventa,idusuario) => {
        await axios.put(`${URI}/inactiva/`, {idventa,idusuario}, config);
        getVentas();
    }

    const handleExport = () => {
        var wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Venta');
        XLSX.writeFile(wb, 'Venta.xlsx')
    }

    const updateVentaFinal = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        await axios.put(URI + "/put/" + newData.idventa, newData, config
        );
        getVentas();
    }


    const columns = [
        {
            title: 'id',
            dataIndex: 'idventa',
            width: '5%',
            editable: false,
            ...getColumnSearchProps('idventa'),
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente',
            editable: false,
            //width: '22%',
            //editable: true,
            //...getColumnSearchProps('nombre'),
            render: (cliente) => {
                return (
                    cliente.razon_social
                );
            }
        },
        {
            title: 'Ruc',
            dataIndex: 'cliente',
            editable: false,
            //...getColumnSearchProps('nombre'),
            render: (cliente) => {
                return (
                    cliente.ruc
                );
            }
        },
        {
            title: 'Comprobante',
            dataIndex: 'nro_comprobante',
            //width: '5%',
            editable: false,
            ...getColumnSearchProps('nro_comprobante'),
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            width: '8%',
            editable: false,
        },
        {
            title: 'Monto',
            dataIndex: 'total',
            width: '8%',
            editable: false,
        },
        {
            title: 'Envio',
            dataIndex: 'costo_envio',
            width: '8%',
            editable: false,
        },
        {
            title: 'Iva',
            dataIndex: 'iva_total',
            width: '8%',
            editable: false,
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            width: '10%',
            editable: false,
            render: (_, { estado, idventa }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idventa} >
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
                            onClick={() => save(record.idventa, record)}
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
                            onConfirm={() => confirmDel(record.idventa)}
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
    ];

    const columnDet = [
        {
            title: 'iddetalle',
            dataIndex: 'idventa',
            key: 'idventa',
            width: '2%',
        },
        {
            title: 'Producto',
            dataIndex: 'det_modelo',
            width: '2%',
            render: (det_modelo)=> {
                //console.log(det_modelo)
                return det_modelo.modelo.descripcion
            }
        },
        {
            title: 'Costo',
            dataIndex: 'det_modelo',
            width: '2%',
            render: (det_modelo)=> {
                //console.log(det_modelo)
                return det_modelo.costo
            }
        },
        {
            title: 'Descuento',
            dataIndex: 'descuento',
            width: '2%',
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            width: '2%',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            width: '2%',
            render: (_, { estado, idinventario }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'blue' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idinventario} >
                        {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            width: '5%',
            render: () => (
                null
            ),
        },
    ];


    const isEditing = (record) => record.idventa === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idventa) => {
        message.success('Procesando');
        //deleteVentaFinal(idventa);
        deleteVenta(idventa,idusuario)
    };

    const save = async (idventa, record) => {
        //console.log('record:  ',record.img.length);
        //console.log(idventa);
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idventa === item.idventa);

            if (index > -1) {
                const item = newData[index];
                //console.log(newData);

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                if (record.idventa === item.idventa) {
                    //console.log('Entra en asignacion',record.img);
                    newData[index].img = record.img;
                }

                newData[index].fecha_upd = strFecha;

                //console.log(newData);

                updateVentaFinal(newData[index]);
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
            <h3>Venta</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearventa')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModelExpand columnDet={columnDet} keyDet={'idventa'} token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idventa'} />
        </>
    )
}
export default ListaVenta;