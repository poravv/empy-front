

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import { Button, Form, Input, DatePicker } from 'antd';
import Buscador from '../Utils/Buscador/Buscador';
import { Row, Col, message } from 'antd';
import { getPlanificacion } from '../../services/Planificacion';
import { createConvocatoria,getConvocatoria } from '../../services/Convocatoria';
import { getTurno } from '../../services/Turno';
import moment from 'moment';

//import { IoTrashOutline } from 'react-icons/io5';
//import Table from 'react-bootstrap/Table';

function NuevoConvocatoria({ token}) {
    const navigate = useNavigate();
    const [cupo, setCupo] = useState();
    const [cuotas, setCuotas] = useState();
    const [monto_cuota, setMontoCuota] = useState();
    const [mmora, setMmora] = useState();
    const [idturno, setIdturno] = useState();
    const [planSelect, setPlanSelect] = useState();
    const [finicio, setFinicio] = useState();
    const [ffin, setFfin] = useState();
    const [lstPlan, setLstPlan] = useState([]);
    const [lstTurno, setLstTurno] = useState([]);
    const [lstConvocatoria, setLstConvocatoria] = useState([]);


    useEffect(() => {
        getLstTurno();
        getLstPlan();
        getLstConvocatoria();
        // eslint-disable-next-line
    }, []);

    const getLstPlan = async () => {
        let array=[];
        const res = await getPlanificacion({ token: token, param: 'get' });
        res.body.map((plan) => {
            plan.nombres=plan.curso.descripcion;
            array.push(plan)
            return true;
        })
        setLstPlan(array);
    }
    const getLstTurno = async () => {
        const res = await getTurno({ token: token, param: 'get' });
        setLstTurno(res.body);
    }

    const getLstConvocatoria = async () => {
        const res = await getConvocatoria({ token: token, param: 'get' });
        setLstConvocatoria(res.body);
    }

    const guardaCab = async (valores) => {
        console.log(valores)
        return await createConvocatoria({ token: token, json: valores });
    }


    //procedimiento para actualizar
    const gestionGuardado = async () => {
        //e.preventDefault();
        /*Agregar validacion de que ya no exista el plan con el mismo turno*/
        let validExist = false;
        /*Validacion de existencia de curso con anho lectivo*/
        lstConvocatoria.map((conv)=> {
            if(conv.idplanificacion===planSelect.idplanificacion&&conv.idturno===idturno){
                validExist=true;
            }
            return true;
        });

        if(validExist) {
            message.error('Ya existe esta convocatoria');
            return;
        };
        try {
            guardaCab(
                {
                    cupo:cupo,
                    cant_cuotas:cuotas,
                    monto_cuota:monto_cuota,
                    finicio:moment(finicio).format('YYYY-MM-DD'),
                    ffin: moment(ffin).format('YYYY-MM-DD'),
                    mmora:mmora,
                    estado: 'AC',
                    idanho_lectivo:planSelect.idanho_lectivo,
                    idturno:idturno,
                    idplanificacion:planSelect.idplanificacion
                }
            );
            message.success('Registro almacenado');
            navigate('/convocatoria');

        } catch (e) {
            console.log(e);
            message.error('Error en la creacion');
            return null;
        }

    }


    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/convocatoria');
    }

    const onchangePlan = (value) => {
        //console.log(value);
        lstPlan.find((element) => {
            if (element.idplanificacion === value) {
                setPlanSelect(element);
                return true;
            } else {
                return false;
            }
        });
    };

    const onchangeTurno = (value) => {
        //console.log(value);
        setIdturno(value);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const onchangefecha = (value) => {
        console.log(value)
        setFinicio(value[0].$d);
        setFfin(value[1].$d);
    }

    return (
        <>
            <div style={{ marginBottom: `20px` }}>
                <h2>Convocatoria</h2>
            </div>
            <div>
                <Form
                    //style={{ backgroundColor: `gray` }}
                    initialValues={{ remember: true, }}
                    onFinish={gestionGuardado}
                    autoComplete="off">

                    <Row style={{ justifyContent: `center`, margin: `10px` }}>

                        <Col >
                            <Buscador label={'nombres'} title={'Planificacion'} value={'idplanificacion'} data={lstPlan} onChange={onchangePlan} onSearch={onSearch} />
                        </Col>
                    </Row>

                    <Row style={{ justifyContent: `center`, margin: `5px` }}>
                        <Col >
                            <Buscador label={'descripcion'} title={'Turno'} value={'idturno'} data={lstTurno} onChange={onchangeTurno} onSearch={onSearch} />
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="fecha" >
                                <DatePicker.RangePicker onChange={onchangefecha} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="cupo" >
                                <Input type='number' placeholder='Cupo' value={cupo} onChange={(e) => setCupo(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="cuotas" >
                                <Input type='number' placeholder='Cant. de cuotas' value={cuotas} onChange={(e) => setCuotas(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="montocuota" >
                                <Input type='number' placeholder='Monto cuota' value={monto_cuota} onChange={(e) => setMontoCuota(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="mmora" >
                                <Input type='number' placeholder='Monto mora' value={mmora} onChange={(e) => setMmora(e.target.value)} />
                            </Form.Item>
                        </Col>

                    </Row>
                    

                    <Row style={{ alignItems: `center`, justifyContent: `center` }}>
                        <Form.Item >
                            <Button type="primary" htmlType="submit" style={{ margin: `20px` }} >
                                Guardar
                            </Button>
                            <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                                Cancelar
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </div>
        </>
    );
}

export default NuevoConvocatoria;
/*

 <tfoot >
                                <tr>
                                    <th>Total</th>
                                    <th style={{ textAlign: `start` }} colSpan={7}>
                                        <b>{total}</b>
                                    </th>
                                </tr>
                                <tr>
                                    <th>Total iva</th>
                                    <th style={{ textAlign: `start` }} colSpan={7}>
                                        <b>{parseInt(totalIva) ?? 0}</b>
                                    </th>
                                </tr>
                            </tfoot>
                            */