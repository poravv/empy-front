

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react';
import { Button, Form, Input, message, Radio, Row } from 'antd';
import Buscador from '../Buscador/Buscador';
import UploadFile from '../Utils/Upload';
const { TextArea } = Input;

const URI = 'http://186.158.152.141:3002/automot/api/detmodelo';
const URIPROV = 'http://186.158.152.141:3002/automot/api/proveedor';
const URIMARCA = 'http://186.158.152.141:3002/automot/api/marca';
const URIMODELO = 'http://186.158.152.141:3002/automot/api/modelo';
let fechaActual = new Date();

function NuevoDetModelo({ token, idusuario, idsucursal }) {

    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [modelo, setModelo] = useState([])
    const [marca, setMarca] = useState([])
    const [costo, setCosto] = useState(0);
    const [chasis, setChasis] = useState('');
    const [anho, setAnho] = useState('');
    const [detalle, setDetalle] = useState('');
    const [matricula, setMatricula] = useState('');
    const [color, setColor] = useState('');
    const [idproveedor, setIdproveedor] = useState(0);
    const [idmarca, setIdmarca] = useState(0);
    const [idmodelo, setIdmodelo] = useState(0);
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [tipo_iva, setTipo_iva] = useState(0);
    //Para imagen
    const [previewImage1, setPreviewImage1] = useState('');
    const [previewImage2, setPreviewImage2] = useState('');
    const [previewImage3, setPreviewImage3] = useState('');

    useEffect(() => {
        getProveedor();
        getMarca();
        getModelo();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getProveedor = async () => {
        const res = await axios.get(`${URIPROV}/get`, config);
        setProveedores(res.data.body);
    }

    const getMarca = async () => {
        const res = await axios.get(`${URIMARCA}/get`, config);
        setMarca(res.data.body);
    }
    const getModelo = async () => {
        const res = await axios.get(`${URIMODELO}/get`, config);
        setModelo(res.data.body);
    }

    //procedimiento para actualizar
    const create = async (e) => {

        try {
            await axios.post(URI + "/post", {
                idmodelo: idmodelo,
                idproveedor: idproveedor,
                idusuario_upd: idusuario,
                fecha_insert: strFecha,
                fecha_upd: strFecha,
                estado: "AC",
                tipo_iva: tipo_iva,
                idmarca: idmarca,
                idsucursal: idsucursal,
                img: previewImage1,
                img1: previewImage2,
                img2: previewImage3,
                chasis: chasis,
                anho,
                detalle,
                matricula,
                color,
                costo
            }, config
            );
            navigate('/detmodelo');
            message.success('Registro almacenado');
        } catch (error) {
            message.error('Error en la creacion de registro');
        }

    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/detmodelo');
    }

    const onChange = (value) => {
        setIdproveedor(value)
        console.log(`selected ${value}`);
    };
    const onChangeMarca = (value) => {
        setIdmarca(value)
        //console.log(`selected ${value}`);
    };

    const onChangeModelo = (value) => {
        setIdmodelo(value)
        //console.log(`selected ${value}`);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <h2>Nuevo modelo</h2>
            </div>
            <Form
                name="basic"
                style={{ textAlign: `center` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                //onFinishFailed={create}
                autoComplete="off" >
                <div style={{ marginTop: `15px` }}>
                    <Buscador title={'Proveedor'} label={'razon_social'} value={'idproveedor'} data={proveedores} onChange={onChange} onSearch={onSearch} />
                </div>
                <div style={{ marginTop: `15px` }}>
                    <Buscador title={'Marca'} label={'descripcion'} value={'idmarca'} data={marca} onChange={onChangeMarca} onSearch={onSearch} />
                </div>
                <div style={{ marginTop: `15px`,marginBottom:`15px` }}>
                    <Buscador title={'Modelo'} label={'descripcion'} value={'idmodelo'} data={modelo} onChange={onChangeModelo} onSearch={onSearch} />
                </div>


                <Form.Item name="precio" rules={[{ required: true, message: 'Cargue precio', },]}>
                    <Input type='number' placeholder='Precio' value={costo} onChange={(e) => setCosto(e.target.value)} />
                </Form.Item>

                <Form.Item name="chasis" rules={[{ required: true, message: 'Cargue chasis', },]}>
                    <Input placeholder='Chasis' value={chasis} onChange={(e) => setChasis(e.target.value)} />
                </Form.Item>

                <Form.Item name="anho" rules={[{ required: true, message: 'Cargue año', },]}>
                    <Input type='number' placeholder='Año' value={anho} onChange={(e) => setAnho(e.target.value)} />
                </Form.Item>

                <Form.Item name="detalle" rules={[{ required: true, message: 'Cargue detalle', },]}>
                    <TextArea placeholder='Detalle' value={detalle} onChange={(e) => setDetalle(e.target.value)} />
                </Form.Item>

                <Form.Item name="matricula" rules={[{ required: true, message: 'Cargue matricula', },]}>
                    <Input placeholder='Matricula' value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                </Form.Item>

                <Form.Item name="color" rules={[{ required: true, message: 'Cargue color', },]}>
                    <Input placeholder='Color' value={color} onChange={(e) => setColor(e.target.value)} />
                </Form.Item>

                <Row style={{ alignItems: `center` }}>
                    <Form.Item label='Tipo iva:' rules={[{ required: true, message: 'Seleccione tipo de iva', },]} >
                        <Radio.Group onChange={(e) => setTipo_iva(e.target.value)} value={tipo_iva}>
                            <Radio disabled value={5}>5%</Radio>
                            <Radio value={10}>10%</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="imagen" style={{ margin: `10px` }}  >
                        <UploadFile previewImage={previewImage1} setPreviewImage={setPreviewImage1} />
                    </Form.Item>

                    <Form.Item name="imagen" style={{ margin: `10px` }}  >
                        <UploadFile previewImage={previewImage2} setPreviewImage={setPreviewImage2} />
                    </Form.Item>

                    <Form.Item name="imagen" style={{ margin: `10px` }}  >
                        <UploadFile previewImage={previewImage3} setPreviewImage={setPreviewImage3} />
                    </Form.Item>

                </Row>

                <Form.Item
                    style={{ margin: `20px` }}>
                    <Button type="primary" htmlType="submit" style={{ margin: `20px` }} >
                        Guardar
                    </Button>
                    <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default NuevoDetModelo;

/*

                

*/