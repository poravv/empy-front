//import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
//import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../../TableModel/TableModel';
import { message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";
import { getProceso,updateEvaluaciones } from '../../../services/Evaluaciones';
//import { getUniqueConvocatoria } from '../../../services/Convocatoria';
import { getUniqueMateria } from '../../../services/Materia';


let fechaActual = new Date();
const ListaProceso = ({ token }) => {
    const { idconvocatoria } = useParams();
    const { idmateria } = useParams();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    //const [convocatoria, setConvocatoria] = useState();
    const [materia, setMateria] = useState();
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
        getLstProcesos();
        buscaMateria();
        //getConvocatoria(idconvocatoria);
        // eslint-disable-next-line
    }, []);

    const buscaMateria = async () => {
        const res = await getUniqueMateria({ token: token, param: idmateria });
        console.log(res.body)
        setMateria(res.body);
    }

    /*
    const getConvocatoria = async (idconvocatoria) => {
        const res = await getUniqueConvocatoria({ token: token, param: idconvocatoria });
        //console.log(res.body)
        setConvocatoria(res.body);
    }
    */

    const getLstProcesos = async () => {
        const res = await getProceso({ token: token, param1: idconvocatoria,param2:idmateria });
        console.log(res.body)
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
        XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');
        XLSX.writeFile(wb, 'Evaluaciones.xlsx')
    }

    const handleUpdate = async (newData) => {
        //console.log('Entra en update');
        console.log(newData)
        await updateEvaluaciones({ token: token, param1: newData.idinscripcion,param2:idmateria, json: newData })
        getLstProcesos();
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'idinscripcion',
            width: '3%',
            editable: false,
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            width: '9%',
            editable: false,
            ...getColumnSearchProps('nombre'),
            
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            width: '9%',
            editable: false,
            ...getColumnSearchProps('apellido'),
        },
        {
            title: 'Documento',
            dataIndex: 'documento',
            width: '7%',
            editable: false,
            ...getColumnSearchProps('documento'),
        },
        {
            title: 'TPI-1',
            dataIndex: 'tpi1',
            width: '6%',
            editable: true,
            inputType:'number'
        },
        {
            title: 'TPI-2',
            dataIndex: 'tpi2',
            width: '6%',
            editable: true,
            inputType:'number'
        },
        {
            title: 'EX-P',
            dataIndex: 'exp1',
            width: '6%',
            editable: true,
            inputType:'number'
        },
        {
            title: 'TPG-1',
            dataIndex: 'tpg1',
            width: '6%',
            editable: true,
            inputType:'number'
        },
        {
            title: 'TPG-2',
            dataIndex: 'tpg2',
            width: '6%',
            editable: true,
            inputType:'number'
        },
        {
            title: 'TPG-3',
            dataIndex: 'tpg3',
            width: '6%',
            editable: true,
            inputType:'number'
        },
        {
            title: 'EX-F',
            dataIndex: 'exf',
            width: '6%',
            editable: true,
            inputType:'number'
        },
        {
            title: 'Accion',
            dataIndex: 'operacion',
            width: '6%',
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
                //inputType: col.dataIndex === 'age' ? 'number' : 'text',
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/gestion');
    }

    return (
        <>
            <h1>Proceso</h1>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{
                display: `flex`,
                width: `100%`,
                height: `40px`,
                alignItems: `center`,
                justifyContent: `center`,
                //backgroundColor:`red`,
                marginBottom: `5px`,
                border: `10px`,
                backgroundColor: `#CBD5DE`,
                borderRadius: `5px`,
                textAlign: `center`
            }}>
                {/*convocatoria ? convocatoria.planificacion.curso.descripcion + ' Turno ' + convocatoria.turno.descripcion : null*/}
                {materia ? materia.descripcion : null}
            </div>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idinscripcion'} varx={1400} />
            <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                Atras
            </Button>
        </>
    )
}

export default ListaProceso;
