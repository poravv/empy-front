

import {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import { Button, Form, Input, DatePicker } from 'antd';
import Buscador from '../Utils/Buscador/Buscador';
import { Row, Col, message } from 'antd';
import { IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';
import { getMateria } from '../../services/Materia';
import { getCurso } from '../../services/Curso';

let fechaActual = new Date();

function NuevoPlan({ token, idusuario, idsucursal }) {

    console.log(idsucursal)

    //Parte de nuevo registro por modal
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [tblplantmp, setTblPlanTmp] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalIva, setTotalIva] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [detmodeloSelect, setDetmodeloSelect] = useState(0);
    const [cliente, setCliente] = useState(0);
    const [lstmateria, setLstMateria] = useState([]);
    const [lstcurso, setLstCurso] = useState([]);
    
    
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [lstClientes, setLstClientes] = useState([]);

    useEffect(() => {
        getLstMateria();
        getLstCurso();
        // eslint-disable-next-line
    }, []);

    const getLstMateria = async () => {
        const res = await getMateria({token:token,param:'get'});
        setLstMateria(res.body);
    }

    const getLstCurso = async () => {
        const res = await getCurso({token:token,param:'get'});
        setLstCurso(res.body);
    }

    /*
       

    
        const getClientes = async () => {
            const res = await axios.get(`${URICLI}/get`, config);
            setLstClientes(res.data.body);
        }
        const verificaproceso = async () => {
            return await axios.post(URI + `/verificaproceso/${idusuario}-inplanrio`, {}, config);
        }
    */



    const guardaCab = async (valores) => {
        //return await axios.post(URI + "/post/", valores, config);
    }

    const guardaDetalle = async (valores) => {
        //await axios.post(URIINVDET + "/post/", valores, config);
    }

    const actualizaDetmodelo = async (iddet_modelo) => {
        //console.log('Entra en ups detmodelo: ',iddet_modelo)
        //await axios.put(URIMODELO + `/put/${iddet_modelo}`, {estado:'VE'}, config);
    }


    //procedimiento para actualizar
    const gestionGuardado = async () => {
        //e.preventDefault();
        try {
            guardaCab(
                {
                    idusuario: idusuario,
                    idcliente: cliente.idcliente,
                    estado: 'AC',
                    fecha: strFecha,
                    iva_total: totalIva,
                    total: total,
                    costo_envio: 0,
                    nro_comprobante: 0
                }
            ).then((cabecera) => {
                try {
                    //console.log('cab: ',cabecera.data.body);
                    //console.log('Entra en guarda detalle')
                    //Guardado del detalle
                    tblplantmp.map((plan) => {
                        console.log(plan);
                        console.log('iddet_modelo: ', plan.detmodelo.iddet_modelo)
                        console.log('descuento: ', plan.descuento)
                        console.log('subtotal: ', (plan.detmodelo.costo))
                        console.log('idplan: ', (cabecera.data.body.idplan))

                        guardaDetalle({
                            iddet_modelo: plan.detmodelo.iddet_modelo,
                            //estado: plan.detmodelo.estado,
                            estado: 'AC',
                            descuento: plan.descuento,
                            idplan: cabecera.data.body.idplan,
                            subtotal: plan.detmodelo.costo,
                        });
                        actualizaDetmodelo(plan.detmodelo.iddet_modelo);

                        return true;

                    });

                    message.success('Registro almacenado');

                } catch (error) {
                    console.log(error);
                    message.error('Error en la creacion');
                    return null;
                }
                navigate('/plan');
            });

        } catch (e) {
            console.log(e);
            message.error('Error en la creacion');
            return null;
        }

    }

    const agregarLista = async (e) => {
        e.preventDefault();

        //console.log(detmodeloSelect);

        //Validacion de existencia del detmodelo dentro de la lista 
        //const detmodeloSelect = lstdetmodelo.filter((inv) => inv.iddet_modelo === iddet_modeloSelect);
        const validExist = tblplantmp.filter((inv) => inv.iddet_modelo === detmodeloSelect.iddet_modelo);

        if (detmodeloSelect !== null) {
            if (validExist.length === 0) {
                tblplantmp.push({
                    iddet_modelo: detmodeloSelect.iddet_modelo,
                    detmodelo: detmodeloSelect,
                    descuento: descuento
                });

                setTotal(parseInt(total + (detmodeloSelect.costo) - descuento));
                setTotalIva(parseInt(totalIva + ((detmodeloSelect.costo * detmodeloSelect.tipo_iva / 100))));

            } else {
                message.warning('Producto ya existe');
            }
        } else {
            message.warning('Seleccione un detmodelo');
        }
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/plan');
    }

    const onChangedetmodelo = (value) => {
        console.log(value);
        //console.log(lstdetmodelo);
        lstmateria.find((element) => {

            if (element.iddet_modelo === value) {
                //console.log(element);
                setDetmodeloSelect(element)
                return true;
            } else {
                return false;
            }
        });
    };
    // eslint-disable-next-line
    const onChangeCliente = (value) => {

        lstClientes.find((element) => {
            if (element.idcliente === value) {
                //console.log(element);
                setCliente(element)
                return true;
            } else {
                return false;
            }
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const extraerRegistro = async (e, id, costo, monto_iva) => {
        e.preventDefault();
        //console.log('Datos: ',costo,monto_iva)
        const updtblPlan = tblplantmp.filter(inv => inv.iddet_modelo !== id);
        setTblPlanTmp(updtblPlan);

        setTotal(total - costo);
        setTotalIva(totalIva - monto_iva);

    };

    return (
        <>
            <div style={{ marginBottom: `20px` }}>
                <h2>Planificación</h2>
            </div>
            <div>
                <Form
                    //style={{ backgroundColor: `gray` }}
                    initialValues={{ remember: true, }}
                    onFinish={gestionGuardado}
                    autoComplete="off">
                    <Row style={{ justifyContent: `center`, margin: `10px` }}>
                        <Col style={{ marginLeft: `15px`,marginTop:`10px` }}>
                            <Buscador label={'descripcion'} title={'Curso'} value={'idcurso'} data={lstcurso} onChange={onChangedetmodelo} onSearch={onSearch} />
                        </Col>
                        <Col style={{ marginLeft: `15px`,marginTop:`10px` }}>
                            <Buscador label={'descripcion'} title={'Materia'} value={'idmateria'} data={lstmateria} onChange={onChangedetmodelo} onSearch={onSearch} />
                        </Col>
                        
                    </Row>
                    <Row style={{ justifyContent: `center`, margin: `10px` }}>
                        
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="hora" >
                                <Input type='number' placeholder='Carga horaria' value={descuento} onChange={(e) => setDescuento(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="fecha" >
                                <DatePicker.RangePicker />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Button type="primary" htmlType="submit" onClick={(e) => agregarLista(e)} >
                                Agregar
                            </Button>
                        </Col>
                    </Row>
                    <div style={{ alignItems: `center`, justifyContent: `center`, margin: `0px`, display: `flex` }}>
                        <Table style={{ backgroundColor: `white` }}>
                            <thead style={{ backgroundColor:`#03457F`,color:`white` }}>
                                <tr >
                                    <th >Materia</th>
                                    <th>Carga horaria</th>
                                    <th>Fecha inicio</th>
                                    <th>Fecha fin</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tblplantmp.length !== 0 ? tblplantmp.map((inv) => (
                                    <tr key={inv.iddet_modelo}>
                                        <td> {inv.detmodelo.descmodelo} </td>
                                        <td> {inv.detmodelo.costo} </td>
                                        <td> {inv.descuento} </td>
                                        <td> {inv.detmodelo.tipo_iva + '%'} </td>
                                        <td> {inv.detmodelo.costo * inv.detmodelo.tipo_iva / 100} </td>
                                        <td> {(inv.detmodelo.costo * inv.detmodelo.tipo_iva / 100)} </td>
                                        <td> {inv.detmodelo.costo} </td>
                                        <td>
                                            <button onClick={(e) => extraerRegistro(e, inv.iddet_modelo, (inv.detmodelo.costo - descuento), parseInt((inv.detmodelo.costo * inv.detmodelo.tipo_iva) / 100))} className='btn btn-danger'><IoTrashOutline /></button>
                                        </td>
                                    </tr>
                                )) : null
                                }
                                <tr key={1}>
                                    <td> {'Ciencias'} </td>
                                    <td> {'100'} </td>
                                    <td> {'10-01-2023'} </td>
                                    <td> {'25-06-2023'} </td>
                                    <td>
                                        <button className='btn btn-danger'><IoTrashOutline /></button>
                                    </td>
                                </tr>
                            </tbody>

                        </Table>
                    </div>

                    <Row style={{ alignItems: `center`, justifyContent: `center` }}>
                        <Form.Item >
                            <Button type="primary" htmlType="submit" style={{ margin: `10px` }} >
                                Guardar
                            </Button>
                            <Button type="primary" htmlType="submit" onClick={btnCancelar}  >
                                Cancelar
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </div>
        </>
    );
}

export default NuevoPlan;
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