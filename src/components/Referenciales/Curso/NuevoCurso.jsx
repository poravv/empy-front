

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, Input } from 'antd';
import { createCurso } from '../../../services/Curso';

function NuevoCurso({ token }) {

    //Parte de nuevo registro por modal
    const [descripcion, setDescripcion] = useState('');
    const navigate = useNavigate();
    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        await createCurso({ token: token, json: { descripcion: descripcion, estado: "AC" } });
        navigate('/curso');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/curso');
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <h2>Nuevo curso</h2>
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

                <Form.Item name="descripcion" rules={[{ required: true, message: 'Cargue curso', },]}>
                    <Input placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
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

export default NuevoCurso;

/*

                

*/