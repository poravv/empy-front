

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input, Radio, Divider, message } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getPersona } from '../../../services/Persona';
import { getSucursal } from '../../../services/Sucursal';
import { createUsuario, getUsuario } from '../../../services/Usuario';


function NuevoUsuario({ token }) {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [sucursalSelect, setSucursalSelect] = useState();
    const [personas, setPersonas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [idpersona, setIdpersona] = useState(0);
    const [usuario, setUsuario] = useState(0);
    const [nivel, setNivel] = useState(0);


    useEffect(() => {
        getLstPersonas();
        getLstUsuario();
        getLstSucursales();
        // eslint-disable-next-line
    }, []);

    const getLstUsuario = async () => {
        const res = await getUsuario({ token: token });
        //console.log(res.body)
        setData(res.body);
    }

    const getLstPersonas = async () => {
        const res = await getPersona({ token: token, param: 'get' });
        setPersonas(res.body);
    }

    const getLstSucursales = async () => {
        const res = await getSucursal({ token: token, param: 'get' });
        setSucursales(res.body);
    }

    const navigate = useNavigate();



    //procedimiento para crear registro
    const create = async (e) => {
        //e.preventDefault();
        let saveusuario;
        let valid = true;

        data.map((usu) => {
            if (usu.idpersona===idpersona && usu.nivel === nivel && usu.idsucursal===sucursalSelect.idsucursal) {
                valid = false;
            }
            return true;
        });

        if (valid) {
            saveusuario = {
                usuario: usuario,
                nivel: nivel,
                password: `cinae${documento}`,
                estado: 'AC',
                idpersona: idpersona,
                idsucursal: sucursalSelect.idsucursal
            }
            await createUsuario({ token: token, json: saveusuario });
            /*Agregar disminucion de cuota*/
            navigate(`/usuario`);
            message.success('Registro almacenado');
        }else{
            message.error('Ya posee usuario con este nivel en esta sucursal');
        }
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate(`/usuario`);
    }

    const onChangePersona = (value) => {
        //console.log(value)
        personas.find((element) => {
            if (element.idpersona === value) {
                //console.log('Elemento:', element);
                setNombre(element.nombre);
                setApellido(element.apellido);
                setDocumento(element.documento);
                setIdpersona(element.idpersona);
                form.setFieldValue('nombre', element.nombre);
                form.setFieldValue('apellido', element.apellido);
                form.setFieldValue('documento', element.documento);
                form.setFieldValue('idpersona', element.idpersona);
                return true;
            } else {
                return false;
            }
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const onchangenivel = (e) => {
        //console.log('radio checked', e.target.value);
        setNivel(e.target.value);
    };

    const onchangeSucursal = (value) => {
        //console.log(value)
        sucursales.find((element) => {
            if (element.idsucursal === value) {
                setSucursalSelect(element)
            }
            return true;
        });
    };
    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <h2>Formulario de usuario</h2>
            </div>
            <Form
                name="basic"
                layout="vertical"
                style={{ textAlign: `center` }}
                labelCol={{ span: 10, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                //onFinishFailed={create}
                autoComplete="off"
                form={form} >
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Busqueda de documento</Divider>
                <div style={{ marginBottom: `20px` }}>
                    <Buscador label={'documento'} title={'Documento'} value={'idpersona'} data={personas} onChange={onChangePersona} onSearch={onSearch} />
                </div>
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Datos persona</Divider>
                {idpersona !== 0 ?
                    <Form.Item
                        label='Idpersona'
                        id='idpersona' name="idpersona" >
                        <Input disabled value={idpersona} onChange={(e) => setIdpersona(e.target.value)} />
                    </Form.Item>
                    : null}
                {documento !== '' ? <Form.Item label={'Documento de identidad'} id='documento' name="documento" >
                    <Input placeholder='Documento de identidad' disabled value={documento} onChange={(e) => setDocumento(e.target.value)} />
                </Form.Item>
                    : null}
                {nombre !== '' ?
                    <Form.Item id='nombre' name="nombre" rules={[{ required: true, message: 'Cargue nombre', },]}>
                        <Input placeholder='nombre' disabled value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </Form.Item>
                    : null}
                {apellido !== '' ?
                    <Form.Item name="apellido" rules={[{ required: true, message: 'Cargue apellido', },]}>
                        <Input placeholder='Apellido' disabled value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    </Form.Item> : null}


                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Usuario</Divider>

                <Form.Item id='usuario' name="usuario" rules={[{ required: true, message: 'Cargue nombre', },]}>
                    <Input placeholder='Usuario' value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                </Form.Item>
                <div style={{ marginBottom: `20px` }}>
                    <Buscador label={'sucursal'} title={'Escuela'} value={'idsucursal'} data={sucursales} onChange={onchangeSucursal} onSearch={onSearch} />
                </div>
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Nivel</Divider>
                <div style={{ marginBottom: `20px`, display: `flex` }}>
                    <Radio.Group onChange={onchangenivel} value={nivel}>
                        <Radio value={1}>Admin</Radio>
                        <Radio value={2}>Instructor</Radio>
                        <Radio value={3}>Estudiante</Radio>
                    </Radio.Group>
                </div>
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

export default NuevoUsuario;

