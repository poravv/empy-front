import { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx/xlsx.mjs';
//import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../TableModel/TableModel';
import { Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";
import { getPlanInstructor } from '../../services/Planificacion';


const ListaGestion = ({ token, usuario }) => {

    //console.log(usuario.idpersona)

    const [form] = Form.useForm();
    const [data, setData] = useState([]);


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
        const res = await getPlanInstructor({ token: token, param: usuario.idpersona });
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'iddet_planificacion',
            width: '12%',
            editable: false,
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Materia',
            dataIndex: 'materia',
            //width: '22%',
            editable: false,
        },
        {
            title: 'Curso',
            dataIndex: 'curso',
            //width: '22%',
            editable: false,
        },
        {
            title: 'Turno',
            dataIndex: 'turno',
            //width: '22%',
            editable: false,
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
            title: 'Gestion',
            dataIndex: 'gestion',
            width: '20%',
            render: (_, record) => {
                return (
                    <>
                        <Button onClick={() => navigate(`/asistencia/${record.iddet_planificacion}`)} >Asistencia</Button>
                        <Button style={{ marginLeft: `10px` }} onClick={() => navigate(`/proceso/${record.idconvocatoria}/${record.idmateria}`)} >Proceso</Button>
                    </>
                )
            },
        },
    ];

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
            }),
        };
    });

    return (
        <>
            <h3>Gestion de cursos</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94Informatica5`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>

            </div>
            <TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'iddet_planificacion'} />
        </>
    )
}
export default ListaGestion;
/*<Button type="primary" onClick={() => navigate('/crearplan')} >{<PlusOutlined />} Nuevo</Button>*/