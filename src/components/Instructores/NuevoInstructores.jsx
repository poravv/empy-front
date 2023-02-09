

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import React from 'react';
import { Button, Form, Input,DatePicker } from 'antd';
import Buscador from '../Buscador/Buscador';

const data = [
    { idpersona: 1, documento: '3123456', nombre:`Andres`,apellido:`Vera`},
    { idpersona: 2, documento: '2176454', nombre:`Ramon`,apellido:`Velazquez`},
]

//const URI = 'http://186.158.152.141:3002/automot/api/instructor/';
function NuevoInstructor({ token }) {

    //Parte de nuevo registro por modal
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [detmodeloSelect, setDetmodeloSelect] = useState(0);

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
        navigate('/instructor');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/instructor');
    }
    const onChangedetmodelo = (value) => {
        //console.log(value);
        //console.log(lstdetmodelo);
        data.find((element) => {

            if (element.idpersona === value) {
                console.log('Elemento:',element);
                setDetmodeloSelect(element);
                setNombre(element.nombre);
                setApellido(element.apellido)
                return true;
            } else {
                return false;
            }
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
        setDetmodeloSelect(value)
    };


    return (
        <div >
            <div style={{ marginBottom:`20px` }}>
                <h2>Nueva instructor</h2>
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
                 
                
                <div style={{ marginBottom:`20px` }}>
                <Buscador label={'documento'} title={'-- documento --'} value={'idpersona'} data={data} onChange={onChangedetmodelo} onSearch={onSearch} />
                </div>
                
                <Form.Item name="nombre" rules={[{ required: true, message: 'Cargue nombre', },]}>
                    <Input placeholder='nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Form.Item>

                <Form.Item name="apellido" rules={[{ required: true, message: 'Cargue apellido', },]}>
                    <Input placeholder='Apellido' value={apellido} onChange={(e) => setApellido(e.target.value)} />
                </Form.Item>

                <div style={{ marginBottom:`20px`,display:`flex` }}>
                <DatePicker style={{ width: '66%' }} placeholder={'Fecha de nacimiento'} />
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

export default NuevoInstructor;

/*

                

*/