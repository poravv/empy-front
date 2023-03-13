

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import UploadFile from '../../Utils/Upload';
import { Button, Form, Input, DatePicker, Radio, Row, Divider } from 'antd';
import Buscador from '../../Utils/Buscador/Buscador';
import { getPersona, createPersona, updatePersona } from '../../../services/Persona';
import { getCiudad } from '../../../services/Ciudad';
import { getGradosArma } from '../../../services/GradosArma';
import moment from 'moment';
import { NACIONALIDAD } from '../../Utils/Nacionalidades'


function NuevoPersona({ token }) {
    const [form] = Form.useForm();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fnacimiento, setFnacimiento] = useState('');
    const [documento, setDocumento] = useState('');
    const [contDocumento, setContDocumento] = useState(false);
    const [direccion, setDireccion] = useState('');
    const [photo, setPhoto] = useState('');
    const [tipo_doc, setTipo_doc] = useState('');
    const [nacionalidad, setNacionalidad] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [valueSexo, setValueSexo] = useState('');
    const [gradosArmas, setGradosArmas] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [idgrados_arma, setIdgrados_armas] = useState('');
    const [idciudad, setIdciudad] = useState(0);
    const [idpersona, setIdpersona] = useState(0);

    useEffect(() => {
        getLstCiudad();
        getLstGradosArmas();
        getLstPersonas();
        // eslint-disable-next-line
    }, []);



    const onChangeRadio = (e) => {
        console.log('radio checked', e.target.value);
        setValueSexo(e.target.value);
    };

    const onChangeRadioTipoDoc = (e) => {
        console.log('radio checked', e.target.value);
        setTipo_doc(e.target.value);
    };


    const getLstCiudad = async () => {
        const res = await getCiudad({ token: token, param: 'get' });
        setCiudades(res.body);
    }

    const getLstPersonas = async () => {
        const res = await getPersona({ token: token, param: 'get' });
        setPersonas(res.body);
    }

    const getLstGradosArmas = async () => {
        const res = await getGradosArma({ token: token, param: 'get' });
        setGradosArmas(res.body);
    }

    const onChangeCiudad = (value) => {
        setIdciudad(value)
        form.setFieldValue('idciudad', value);
        console.log(`selected ${value}`);
    };

    const onChangeNacionalidad = (value) => {
        setNacionalidad(value)
        form.setFieldValue('nacionalidad', value);
        console.log(`selected ${value}`);
    };

    const onChangeIdGradosArmas = (value) => {
        setIdgrados_armas(value);
        form.setFieldValue('idgrados_arma', value);
        console.log(`selected ${value}`);
    };

    const navigate = useNavigate();



    //procedimiento para crear registro
    const create = async (e) => {
        //console.log(fnacimiento._i);
        //console.log(moment(fnacimiento).format('YYYY-MM-DD'));

        //e.preventDefault();
        let bandera = true;
        /*Verificar si existe para actualizar o crear posteriormente */
        let savePersona;
        /*Para validad undefine*/
        //if(!idpersona||idpersona===0){console.log('Idpersona es null');return false}

        personas.find((persona) => {
            if (persona.idpersona === idpersona) {
                bandera = false;
                return true;
            }
            if (persona.documento === documento) {
                bandera = false;
                setIdpersona(persona.idpersona)
                return true;
            } 
            return false;
        });

        if (bandera) {
            /*Create*/
            savePersona = {
                nombre: nombre,
                apellido: apellido,
                fnacimiento: moment(fnacimiento).format('YYYY-MM-DD'),//fnacimiento._i??
                sexo: valueSexo,
                documento: documento,
                estado: 'AC',
                direccion: direccion,
                photo: photo,
                tipo_doc: tipo_doc,
                nacionalidad: nacionalidad,
                correo: correo,
                telefono: telefono,
                idgrados_arma: idgrados_arma,
                idciudad: idciudad,
            };
            await createPersona({ token: token, json: savePersona });
        } else {
            savePersona = {
                idpersona: idpersona,
                nombre: nombre,
                apellido: apellido,
                fnacimiento: moment(fnacimiento).format('YYYY-MM-DD') ?? fnacimiento._i,
                sexo: valueSexo,
                documento: documento,
                estado: 'AC',
                direccion: direccion,
                photo: photo,
                tipo_doc: tipo_doc,
                nacionalidad: nacionalidad,
                correo: correo,
                telefono: telefono,
                idgrados_arma: idgrados_arma,
                idciudad: idciudad
            };
            /*Actualiza y crea persona*/
            await updatePersona({ token: token, param: savePersona.idpersona, json: savePersona }).then((resultado) => {
                console.log(resultado)
            });

        }
        navigate('/persona');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/persona');
    }

    const changeDate = (fnac) => {
        //console.log('Fecha:', typeof fnac);
        //console.log(moment(fnac).format('DD.MM.YYYY'))
        //console.log(moment(fnac))
        //console.log(fnac)
        //console.log(new Date().toJSON())
        //console.log(JSON.stringify(fnac).substring(1,11));
        //setFnacimiento(fnac);
        if (typeof fnac == 'object') {
            setFnacimiento(fnac);
        } else {
            setFnacimiento(moment(fnac));
        }
    }

    const onChangePersona = (value) => {
        //console.log(value)
        personas.find((element) => {
            if (element.idpersona === value) {
                //console.log('Elemento:', element);
                setNombre(element.nombre);
                setApellido(element.apellido);
                setDocumento(element.documento);
                setContDocumento(true);
                setValueSexo(element.sexo);
                setDireccion(element.direccion);
                setPhoto(element.photo);
                setTipo_doc(element.tipo_doc);
                setNacionalidad(element.nacionalidad);
                onChangeNacionalidad(element.nacionalidad);
                setCorreo(element.correo);
                setTelefono(element.telefono);
                setIdgrados_armas(element.idgrados_arma);
                setIdciudad(element.idciudad);
                setFnacimiento(element.fnacimiento);
                setIdpersona(element.idpersona);

                //changeDate(JSON.stringify(element.fnacimiento));

                form.setFieldValue('nombre', element.nombre);
                form.setFieldValue('apellido', element.apellido);
                form.setFieldValue('documento', element.documento);
                form.setFieldValue('sexo', element.sexo);
                form.setFieldValue('direccion', element.direccion);
                form.setFieldValue('nacionalidad', element.nacionalidad);
                form.setFieldValue('correo', element.correo);
                form.setFieldValue('telefono', element.telefono);
                form.setFieldValue('idciudad', element.idciudad);
                form.setFieldValue('idgrados_arma', element.idgrados_arma);
                form.setFieldValue('idpersona', element.idpersona);
                form.setFieldValue('fnacimiento', element.fnacimiento);

                //console.log(new Date())
                return true;
            } else {
                return false;
            }
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };


    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <h2>Formulario de persona</h2>
            </div>
            <Form
                name="basic"
                layout="vertical"
                style={{ textAlign: `center` }}
                labelCol={{ span: 8, }}
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
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Datos personales</Divider>
                {idpersona !== 0 ?
                    <Form.Item
                        label='Idpersona'
                        id='idpersona' name="idpersona" >
                        <Input disabled value={idpersona} onChange={(e) => setIdpersona(e.target.value)} />
                    </Form.Item>
                    : null}
                <Form.Item label={'Documento de identidad'} id='documento' name="documento" rules={[{ required: true, message: 'Cargue numero de documento', },]}>
                    <Input placeholder='Documento de identidad' disabled={contDocumento} value={documento} onChange={(e) => setDocumento(e.target.value)} />
                </Form.Item>

                <Form.Item id='nombre' name="nombre" rules={[{ required: true, message: 'Cargue nombre', },]}>
                    <Input placeholder='nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Form.Item>

                <Form.Item name="apellido" rules={[{ required: true, message: 'Cargue apellido', },]}>
                    <Input placeholder='Apellido' value={apellido} onChange={(e) => setApellido(e.target.value)} />
                </Form.Item>
                <Form.Item id='correo' name="correo" type="mail" rules={[{ required: true, message: 'Cargue correo', },]}>
                    <Input placeholder='Correo' value={correo} onChange={(e) => setCorreo(e.target.value)} />
                </Form.Item>
                <Form.Item id='telefono' name="telefono" rules={[{ required: true, message: 'Cargue telefono', },]}>
                    <Input placeholder='Telefono' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </Form.Item>
                <Form.Item id='direccion' name="direccion" rules={[{ required: true, message: 'Cargue direccion', },]}>
                    <Input placeholder='Direccion' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </Form.Item>
                {fnacimiento ? <Form.Item id='fnacimiento' name="fnacimiento" >
                    <Input disabled value={fnacimiento} />
                </Form.Item> 
                : null}
                <div style={{ marginBottom: `20px`, display: `flex` }}>
                    <DatePicker
                        //id='fnacimiento' name='fnacimiento'
                        //defaultValue={fnacimiento}
                        //value={fnacimiento}
                        format="YYYY-MM-DD"
                        onChange={date => changeDate(date)}
                        style={{ width: '67%' }} placeholder={'Fecha de fnacimiento'} />
                </div>
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Sexo</Divider>
                <div style={{ marginBottom: `20px`, display: `flex` }}>
                    <Radio.Group onChange={onChangeRadio} value={valueSexo}>
                        <Radio value={'MA'}>Masculino</Radio>
                        <Radio value={'FE'}>Femenino</Radio>
                    </Radio.Group>
                </div>
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Tipo de documento</Divider>
                <div style={{ marginBottom: `0px`, display: `flex` }}>
                    <Radio.Group onChange={onChangeRadioTipoDoc} value={tipo_doc}>
                        <Radio value={'CI'}>Cedula de identidad</Radio>
                        <Radio value={'DE'}>Documento Extranjero</Radio>
                    </Radio.Group>
                </div>
                <div style={{ marginBottom: `0px` }}>
                    <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Nacionalidad</Divider>
                    {nacionalidad ?
                        <Form.Item
                            //label='Nacionalidad' 
                            id='nacionalidad' name="nacionalidad" >
                            <Input disabled value={nacionalidad} />
                        </Form.Item>
                        : null}
                    <Buscador title={'Nacionalidad'} label={'label'} value={'value'} data={NACIONALIDAD} onChange={onChangeNacionalidad} onSearch={onSearch} />
                </div>
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Ciudad</Divider>
                <div style={{ marginBottom: `0px` }}>
                    {idciudad ?
                        <Form.Item
                            //label='Ciudad' 
                            id='idciudad' name="idciudad" >
                            <Input disabled value={idciudad} />
                        </Form.Item>
                        : null}
                    <Buscador title={'Ciudad'} label={'descripcion'} value={'idciudad'} data={ciudades} onChange={onChangeCiudad} onSearch={onSearch} />
                </div>
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Rango</Divider>
                <div style={{ marginBottom: `0px` }}>
                    {idgrados_arma ?
                        <Form.Item
                            //label='Ciudad' 
                            id='idgrados_arma' name="idgrados_arma" >
                            <Input disabled value={idgrados_arma} />
                        </Form.Item>
                        : null}
                    <Buscador title={'Rango'} label={'grado'} value={'idgrados_arma'} data={gradosArmas} onChange={onChangeIdGradosArmas} onSearch={onSearch} />
                </div>
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Perfil</Divider>
                <Row style={{ alignItems: `center` }}>
                    <Form.Item name="imagen" style={{ margin: `10px` }}  >
                        <UploadFile previewImage={photo} setPreviewImage={setPhoto} />
                    </Form.Item>
                </Row>
                <Divider orientation="left" type="horizontal" style={{ color: `#7CC1FE` }}>Observación</Divider>

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

export default NuevoPersona;
