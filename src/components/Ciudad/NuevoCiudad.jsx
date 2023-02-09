

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import React from 'react';
import { Button, Form, Input } from 'antd';


//const URI = 'http://186.158.152.141:3002/automot/api/ciudad/';
function NuevoCiudad({ token }) {

    //Parte de nuevo registro por modal
    const [descripcion, setDescripcion] = useState('')
    const navigate = useNavigate();

    /*
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    */

    //procedimiento para actualizar
    const create = async (e) => {
        /*
        //e.preventDefault();
        await axios.post(URI + "post/", {
            descripcion: descripcion,
            estado: "AC"
        }, config
        );
        */
        navigate('/ciudad');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/ciudad');
    }


    return (
        <div >
            <div style={{ marginBottom:`20px` }}>
                <h2>Nueva ciudad</h2>
            </div>
            <Form
                name="basic"
                style={{ textAlign: `center` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                //onFinishFailed={create}
                autoComplete="off"
            >

                <Form.Item name="descripcion" rules={[{ required: true, message: 'Cargue ciudad', },]}>
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

export default NuevoCiudad;

/*

                

*/