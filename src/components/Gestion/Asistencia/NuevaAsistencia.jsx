

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Form, DatePicker    } from 'antd';
import { useParams } from "react-router-dom";
import { createAsistencia } from '../../../services/Asistencia';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/es_ES';

function NuevaAsistencia({ token }) {
    const { iddet_planificacion } = useParams();
    //console.log(iddet_planificacion)
    const [fecha, setFecha] = useState();
    //Parte de nuevo registro por modal
    const navigate = useNavigate();
    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        await createAsistencia({ token: token, json: 
                { 
                    iddet_planificacion:iddet_planificacion, 
                    fecha: fecha, 
                    estado: "AC" 
                } 
            });
            navigate(`/asistencia/${iddet_planificacion}`);
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate(`/asistencia/${iddet_planificacion}`);
    }

    const changeDate = (fnac) => {
        //console.log('Fecha:', typeof fnac);
        //console.log(moment(fnac).format('DD.MM.YYYY'))
        //console.log(moment(fnac))
        //console.log(fnac)
        //console.log(new Date().toJSON())
        //console.log(JSON.stringify(fnac).substring(1,11));
        //setFecha(fnac);
        if (typeof fnac == 'object') {
            setFecha(moment(fnac.$d).format('YYYY-MM-DD'));
        } else {
            setFecha(moment(fnac).format('YYYY-MM-DD'));
        }
    }

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <h2>Nueva asistencia</h2>
            </div>
            <Form
                name="basic"
                style={{ textAlign: `center` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                onFinishFailed={create}
                autoComplete="off"
                >
                <div style={{ marginBottom: `20px`, display: `flex` }}>
                    <DatePicker
                        locale={locale}
                        //defaultValue={dayjs('2015-01-01', 'YYYY-MM-DD')}
                        //id='fecha' name='fecha'
                        //defaultValue={fecha}
                        //value={fecha}
                        format="YYYY-MM-DD"
                        onChange={date => changeDate(date)}
                        style={{ width: '67%' }} placeholder={'Fecha de nacimiento'} />
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

export default NuevaAsistencia;
