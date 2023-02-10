

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input } from 'antd';
import { createGradosArma } from '../../services/GradosArma';

function NuevoGradosArma({ token }) {

    //Parte de nuevo registro por modal
    const [descripcion, setDescripcion] = useState('');
    const [observacion, setObservacion] = useState('');
    const navigate = useNavigate();
    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        await createGradosArma({ token: token, json: { descripcion: descripcion,observacion:observacion, estado: "AC" } });
        navigate('/gradosArma');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/gradosArma');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <h2>Nuevo Rango</h2>
            </div>
            <Form
                name="basic"
                style={{ textAlign: `center` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                onFinishFailed={create}
                autoComplete="off" >

                <Form.Item name="descripcion" rules={[{ required: true, message: 'Cargue gradosArma', },]}>
                    <Input placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </Form.Item>
                <Form.Item name="obaservacion" rules={[{ required: false},]}>
                    <Input placeholder='Observacion' value={observacion} onChange={(e) => setObservacion(e.target.value)} />
                </Form.Item>
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

export default NuevoGradosArma;

/*

                

*/