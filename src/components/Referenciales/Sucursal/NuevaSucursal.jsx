

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, message, Row } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import UploadFile from '../../Utils/Upload';
import { getCiudad } from '../../../services/Ciudad';
import { createSucursal } from '../../../services/Sucursal';
const { TextArea } = Input;

function NuevoSucursal({ token }) {

    const [sucursal, setSucursal] = useState('');
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [idciudad, setIdciudad] = useState(0);
    const navigate = useNavigate();
    const [ciudades, setCiudades] = useState([]);
    //Para imagen
    const [previewImage1, setPreviewImage1] = useState('');

    useEffect(() => {
        getLstCiudad();
        // eslint-disable-next-line
    }, []);

    const getLstCiudad = async () => {
        const res = await getCiudad({token:token,param:'get'});
        setCiudades(res.body);
    }

    //procedimiento para actualizar
    const create = async (e) => {

        try {
            await createSucursal({ token: token, json: {
                idciudad: idciudad,
                estado: "AC",
                img: previewImage1,
                sucursal: sucursal,
                ruc:ruc,
                direccion:direccion
            } });
            navigate('/sucursal');
            message.success('Registro almacenado');
        } catch (error) {
            message.error('Error en la creacion de registro');
        }
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/sucursal');
    }

    const onChange = (value) => {
        setIdciudad(value)
        console.log(`selected ${value}`);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <h2>Nueva escuela</h2>
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
                <div style={{ marginBottom: `20px` }}>
                    <Buscador title={'Ciudad'} label={'descripcion'} value={'idciudad'} data={ciudades} onChange={onChange} onSearch={onSearch} />
                </div>

                <Form.Item name="sucursal" rules={[{ required: true, message: 'Cargue sucursal', },]}>
                    <Input placeholder='Escuela' value={sucursal} onChange={(e) => setSucursal(e.target.value)} />
                </Form.Item>

                <Form.Item name="ruc" rules={[{ required: true, message: 'Cargue ruc', },]}>
                    <Input placeholder='Ruc' value={ruc} onChange={(e) => setRuc(e.target.value)} />
                </Form.Item>

                <Form.Item name="direccion" rules={[{ required: true, message: 'Cargue direccion', },]}>
                    <TextArea placeholder='Direccion' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </Form.Item>

                <Row style={{ alignItems: `center` }}>
                    <Form.Item name="imagen" style={{ margin: `10px` }}  >
                        <UploadFile previewImage={previewImage1} setPreviewImage={setPreviewImage1} />
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

export default NuevoSucursal;

/*

                

*/