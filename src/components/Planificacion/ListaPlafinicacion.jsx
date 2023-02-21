import { useState,useEffect, useRef } from 'react'
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
import { getPlanificacion } from '../../services/Planificacion';

let fechaActual = new Date();
const ListaPlan = ({ token }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    //---------------------------------------------------
    
    useEffect(() => {
        getPlan();
        // eslint-disable-next-line
    }, []);

    const getPlan = async () => {        
        const res = await getPlanificacion({token:token,param:'get'});
        console.log(res.body);
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
        await axios.put(URI + "put/" + newData.idplanificacion, newData, config
        );
        getPlan();*/
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'idplanificacion',
            width: '12%',
            editable: false,
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Curso',
            dataIndex: 'curso',
            //width: '22%',
            editable: false,
            //...getColumnSearchProps('curso'),
            render: (_, planificacion) => {
                //console.log(planificacion.curso);
                return (
                    planificacion.curso.descripcion
                );
            },
        },
        {
             title: 'Estado',
             dataIndex: 'estado',
             //width: '7%',
             editable: true,
             render: (_, { estado, idplanificacion }) => {
                 let color = 'black';
                 if (estado.toUpperCase() === 'AC') { color = 'green' }
                 else { color = 'volcano'; }
                 return (
                     <Tag color={color} key={idplanificacion} >
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
                            onClick={() => save(record.idplanificacion)}
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
                            onConfirm={() => confirmDel(record.idplanificacion)}
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
        /*
        {
            title: 'ID',
            dataIndex: 'iddet_planificacion',
            key: 'iddet_planificacion',
            width: '2%',
        },
        */
        {
            title: 'Materia',
            dataIndex: 'materia',
            width: '2%',
            render: (_, record) => {
                //console.log(planificacion.curso);
                if(record.materium){
                    return (
                        record.materium.descripcion??""
                    );
                }else{
                    return null;
                }
                
            },
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
            title: 'Instructor',
            dataIndex: 'idinstructor',
            width: '2%',
            render: (_, record) => {
                //console.log(planificacion.curso);
                if(record.instructor){
                    return (
                        record.instructor.persona.grados_arma.descripcion+' '+record.instructor.persona.nombre+' '+record.instructor.persona.apellido
                    );
                }else{
                    return null;
                }
                
            },
        },
        /*{
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            width: '5%',
            render: () => (
                null
            ),
        },*/
    ];

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.idplanificacion);
    };


    const isEditing = (record) => record.idplanificacion === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idplanificacion) => {
        message.success('Procesando');
        deletePlan(idplanificacion);
    };

    const save = async (idplanificacion) => {
         try {
                    const row = await form.validateFields();
                    const newData = [...data];
                    const index = newData.findIndex((item) => idplanificacion === item.idplanificacion);
        
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
            <h3>Planificacion</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94Informatica5`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>

                <Button type="primary" onClick={() => navigate('/crearplan')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModelExpand columnDet={columnDet} keyDet={'iddet_planificacion'} token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idplanificacion'} />
        </>
    )
}
export default ListaPlan;

//<TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idplanificacion'} />