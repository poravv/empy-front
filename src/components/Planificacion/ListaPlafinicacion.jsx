//import axios from 'axios'
import {
    useState,
    //useEffect, 
    useRef
} from 'react'
//import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
//import TableModel from '../TableModel/TableModel';
import TableModelExpand from '../TableModel/TableModelExpand';
//import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

const data = [
    { idplan: 1, curso: 'Ing Informatica', detalle: [
        { idplan:1,iddetalle: 1, materia: 'Matematica', carga_horaria: '100', finicio: '01-01-2023', ffin: `25-06-2023`, instructor: `Cap. Claudio Ibarra` },
        { idplan:1,iddetalle: 2, materia: 'Ciencias', carga_horaria: '120', finicio: '26-06-2023', ffin: `10-10-2023`, instructor: `Cap. Alexis Aguirre` },
    ] },
    { idplan: 2, curso: 'Analisis de Sistemas', detalle: [
        { idplan:2,iddetalle: 1, materia: 'Matematica', carga_horaria: '100', finicio: '01-01-2023', ffin: `25-06-2023`, instructor: `Cap. Claudio Ibarra` },
        { idplan:2,iddetalle: 2, materia: 'Ciencias', carga_horaria: '120', finicio: '26-06-2023', ffin: `10-10-2023`, instructor: `Cap. Alexis Aguirre` },
    ] },
]


//const URI = 'http://186.158.152.141:3002/automot/api/plan/';
//let fechaActual = new Date();
const ListaPlan = ({ token }) => {
    console.log(data)
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
        getPlan();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getPlan = async () => {
        const res = await axios.get(`${URI}/get`, config)
        /*En caso de que de error en el server direcciona a login* /
        if (res.data.error) {
            Logout();
        }
        /*
        const resDataId = [];

        res.data.body.map((rs) => {
            rs.key = rs.idplan;
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
        XLSX.utils.book_append_sheet(wb, ws, 'Plans');
        XLSX.writeFile(wb, 'Plans.xlsx')
    }

    const deletePlan = async (id) => {
        //await axios.delete(`${URI}/del/${id}`, config)
        //getPlan();
    }
    // eslint-disable-next-line
    const updatePlan = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)

        /*
        await axios.put(URI + "put/" + newData.idplan, newData, config
        );
        getPlan();*/
    }

    const columns = [
        {
            title: 'idplan',
            dataIndex: 'idplan',
            width: '6%',
            editable: false,
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Curso',
            dataIndex: 'curso',
            width: '22%',
            editable: true,
            ...getColumnSearchProps('curso'),
        },
        /* {
             title: 'Estado',
             dataIndex: 'estado',
             //width: '7%',
             editable: true,
             render: (_, { estado, idplan }) => {
                 let color = 'black';
                 if (estado.toUpperCase() === 'AC') { color = 'green' }
                 else { color = 'volcano'; }
                 return (
                     <Tag color={color} key={idplan} >
                         {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                     </Tag>
                 );
             },
         },*/
        {
            title: 'Accion',
            dataIndex: 'operacion',
            render: (_, record) => {

                const editable = isEditing(record);

                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.idplan)}
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
                            onConfirm={() => confirmDel(record.idplan)}
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

    //{iddetalle:11,materia:'Matematica',carga_horaria:'100',finicio:'01-01-2023',ffin:`25-06-2023`,instructor:`Cap. Claudio Ibarra`},

    const columnDet = [
        {
            title: 'iddetalle',
            dataIndex: 'iddetalle',
            key: 'iddetalle',
            width: '2%',
        },
        {
            title: 'Materia',
            dataIndex: 'materia',
            width: '2%',
        },
        {
            title: 'Carga horaria',
            dataIndex: 'carga_horaria',
            width: '2%',
            /*
            render: (det_modelo) => {
                //console.log(det_modelo)
                return det_modelo.costo
            }
            */
        },
        {
            title: 'Fecha inicio',
            dataIndex: 'finicio',
            width: '2%',
        },
        {
            title: 'Fecha fin',
            dataIndex: 'ffin',
            width: '2%',
        },
        {
            title: 'Instructor',
            dataIndex: 'instructor',
            key: 'instructor',
            width: '2%',
            /*
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
            */
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

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.idplan);
    };


    const isEditing = (record) => record.idplan === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idplan) => {
        message.success('Procesando');
        deletePlan(idplan);
    };

    const save = async (idplan) => {
        /*
        
                try {
                    const row = await form.validateFields();
                    const newData = [...data];
                    const index = newData.findIndex((item) => idplan === item.idplan);
        
                    if (index > -1) {
        
                        const item = newData[index];
                        newData.splice(index, 1, {
                            ...item,
                            ...row,
                        });
        
                        newData[index].fecha_upd = strFecha;
                        //console.log(newData);
                        updatePlan(newData[index]);
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
            <h3>Planificacion</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94Informatica5`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>

                <Button type="primary" onClick={() => navigate('/crearplan')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModelExpand columnDet={columnDet} keyDet={'iddetalle'} token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idplan'} />
        </>
    )
}
export default ListaPlan;

//<TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idplan'} />