//import axios from 'axios'
import {
    useState,
    //useEffect, 
    useRef
} from 'react';
//import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
//import TableModel from '../TableModel/TableModel';
import TableModelExpand from '../TableModel/TableModelExpand';
//import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

const data = [
    { idconvocatoria: 1, plan: 'Ing Informatica', turno: 'Tarde', detalle: [
        { idconvocatoria:1,iddetalle: 1, materia: 'Matematica', carga_horaria: '100', finicio: '01-01-2023', ffin: `25-06-2023`, instructor: `Cap. Claudio Ibarra` },
        { idconvocatoria:1,iddetalle: 2, materia: 'Ciencias', carga_horaria: '120', finicio: '26-06-2023', ffin: `10-10-2023`, instructor: `Cap. Alexis Aguirre` },
    ] },
    { idconvocatoria: 2, plan: 'Maestria en Comunicación', turno: 'Mañana', detalle: [
        { idconvocatoria:2,iddetalle: 1, materia: 'Matematica', carga_horaria: '100', finicio: '01-01-2023', ffin: `25-06-2023`, instructor: `Cap. Claudio Ibarra` },
        { idconvocatoria:2,iddetalle: 2, materia: 'Ciencias', carga_horaria: '120', finicio: '26-06-2023', ffin: `10-10-2023`, instructor: `Cap. Alexis Aguirre` },
    ] },
]


//const URI = 'http://186.158.152.141:3002/automot/api/cursosH/';
//let fechaActual = new Date();
const ListaCursosH = ({ token }) => {
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
        getCursosH();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getCursosH = async () => {
        const res = await axios.get(`${URI}/get`, config)
        /*En caso de que de error en el server direcciona a login* /
        if (res.data.error) {
            Logout();
        }
        /*
        const resDataId = [];

        res.data.body.map((rs) => {
            rs.key = rs.idconvocatoria;
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
        XLSX.utils.book_append_sheet(wb, ws, 'CursosHs');
        XLSX.writeFile(wb, 'CursosHs.xlsx')
    }

    const deleteCursosH = async (id) => {
        //await axios.delete(`${URI}/del/${id}`, config)
        //getCursosH();
    }
    // eslint-disable-next-line
    const updateCursosH = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)

        /*
        await axios.put(URI + "put/" + newData.idconvocatoria, newData, config
        );
        getCursosH();*/
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'idconvocatoria',
            width: '6%',
            editable: false,
            ...getColumnSearchProps('idconvocatoria'),
        },
        {
            title: 'Plan',
            dataIndex: 'plan',
            width: '22%',
            editable: true,
            ...getColumnSearchProps('plan'),
        },
        {
            title: 'Turno',
            dataIndex: 'turno',
            width: '22%',
            editable: true,
            ...getColumnSearchProps('turno'),
        },
        /* {
             title: 'Estado',
             dataIndex: 'estado',
             //width: '7%',
             editable: true,
             render: (_, { estado, idconvocatoria }) => {
                 let color = 'black';
                 if (estado.toUpperCase() === 'AC') { color = 'green' }
                 else { color = 'volcano'; }
                 return (
                     <Tag color={color} key={idconvocatoria} >
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
                   <Button  onClick={() => navigate(`/asistencia/${record.idconvocatoria}`)} >Asistencia</Button>
                   <Button style={{ marginLeft:`10px` }}  onClick={() => navigate(`/inscripcion/${record.idconvocatoria}`)} >Lista</Button> 
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
                            onClick={() => save(record.idconvocatoria)}
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
                            onConfirm={() => confirmDel(record.idconvocatoria)}
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
        setEditingKey(record.idconvocatoria);
    };


    const isEditing = (record) => record.idconvocatoria === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idconvocatoria) => {
        message.success('Procesando');
        deleteCursosH(idconvocatoria);
    };

    const save = async (idconvocatoria) => {
        /*
        
                try {
                    const row = await form.validateFields();
                    const newData = [...data];
                    const index = newData.findIndex((item) => idconvocatoria === item.idconvocatoria);
        
                    if (index > -1) {
        
                        const item = newData[index];
                        newData.splice(index, 1, {
                            ...item,
                            ...row,
                        });
        
                        newData[index].fecha_upd = strFecha;
                        //console.log(newData);
                        updateCursosH(newData[index]);
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
            <h3>Cursos / Materias</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94Informatica5`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>

            <TableModelExpand columnDet={columnDet} keyDet={'iddetalle'} token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idconvocatoria'} />
        </>
    )
}
export default ListaCursosH;

//<TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idconvocatoria'} />