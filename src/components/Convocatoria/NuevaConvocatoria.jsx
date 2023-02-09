

import {
    //useEffect, 
    useState
} from 'react'
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import { Button, Form, Input, 
//    DatePicker 
} from 'antd';
import Buscador from '../Buscador/Buscador';
import { Row, Col, message } from 'antd';
//import { IoTrashOutline } from 'react-icons/io5';
//import Table from 'react-bootstrap/Table';

/*
const URI = 'http://186.158.152.141:3002/automot/api/convocatoria';
const URIINVDET = 'http://186.158.152.141:3002/automot/api/detconvocatoria';
const URIMODELO = 'http://186.158.152.141:3002/automot/api/detmodelo';
const URICLI = 'http://186.158.152.141:3002/automot/api/cliente';
*/

const lstplan = [
    { idplan: 1, descripcion: 'Ing Informatica', estado: 'AC' },
    { idplan: 2, descripcion: 'Analisis de Sistemas', estado: 'AC' },
    { idplan: 3, descripcion: 'Programacion avanzada', estado: 'AC' },
]
const lstturno = [
    { idturno: 1, descripcion: 'Mañana', estado: 'AC' },
    { idturno: 2, descripcion: 'Tarde', estado: 'AC' },
    { idturno: 3, descripcion: 'Noche', estado: 'AC' },
]


let fechaActual = new Date();

function NuevoConvocatoria({ token, idusuario, idsucursal }) {

    console.log(idsucursal)

    //Parte de nuevo registro por modal
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    // eslint-disable-next-line
    const [tblconvocatoriatmp, setTblConvocatoriaTmp] = useState([]);
    // eslint-disable-next-line
    // eslint-disable-next-line
    const [total, setTotal] = useState(0);
    // eslint-disable-next-line
    const [totalIva, setTotalIva] = useState(0);
    // eslint-disable-next-line
    const [descuento, setDescuento] = useState(0);
    // eslint-disable-next-line
    const [detmodeloSelect, setDetmodeloSelect] = useState(0);
    // eslint-disable-next-line
    const [cliente, setCliente] = useState(0);
    const navigate = useNavigate();
    // eslint-disable-next-line
    //const [lstdetmodelo, setLstdetmodelo] = useState([]);
    // eslint-disable-next-line
    const [lstClientes, setLstClientes] = useState([]);

    /*
        useEffect(() => {
            getdetmodelos();
            getClientes();
            verificaproceso();
            // eslint-disable-next-line
        }, []);
    
        //CONFIGURACION DE TOKEN
        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        };
    
        const getdetmodelos = async () => {
            const res = await axios.get(`${URIMODELO}/getsucursal/${idsucursal}`, config);
            
            //console.log(res.data);
            let detModel = [];
    
            res.data.body.map((dm) => {
                dm.descmodelo = dm.modelo.descripcion;
                detModel.push(dm)
                return true;
            })
    
            console.log(detModel);
    
            setLstdetmodelo(detModel);
        }
    
        const getClientes = async () => {
            const res = await axios.get(`${URICLI}/get`, config);
            setLstClientes(res.data.body);
        }
        const verificaproceso = async () => {
            return await axios.post(URI + `/verificaproceso/${idusuario}-inconvocatoriario`, {}, config);
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
                    tblconvocatoriatmp.map((convocatoria) => {
                        console.log(convocatoria);
                        console.log('iddet_modelo: ', convocatoria.detmodelo.iddet_modelo)
                        console.log('descuento: ', convocatoria.descuento)
                        console.log('subtotal: ', (convocatoria.detmodelo.costo))
                        console.log('idconvocatoria: ', (cabecera.data.body.idconvocatoria))

                        guardaDetalle({
                            iddet_modelo: convocatoria.detmodelo.iddet_modelo,
                            //estado: convocatoria.detmodelo.estado,
                            estado: 'AC',
                            descuento: convocatoria.descuento,
                            idconvocatoria: cabecera.data.body.idconvocatoria,
                            subtotal: convocatoria.detmodelo.costo,
                        });
                        actualizaDetmodelo(convocatoria.detmodelo.iddet_modelo);

                        return true;

                    });

                    message.success('Registro almacenado');

                } catch (error) {
                    console.log(error);
                    message.error('Error en la creacion');
                    return null;
                }
                navigate('/convocatoria');
            });

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

    const onChangedetmodelo = (value) => {
        console.log(value);
        //console.log(lstdetmodelo);
        lstplan.find((element) => {

            if (element.iddet_modelo === value) {
                //console.log(element);
                setDetmodeloSelect(element)
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
                            <Buscador label={'descripcion'} title={'-- Plan --'} value={'idplan'} data={lstplan} onChange={onChangedetmodelo} onSearch={onSearch} />
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: `center`, margin: `5px` }}>
                    <Col >
                            <Buscador label={'descripcion'} title={'Turno'} value={'idturno'} data={lstturno} onChange={onChangedetmodelo} onSearch={onSearch} />
                        </Col>    
                    </Row>   
                    <Row style={{ justifyContent: `center`, margin: `10px` }}>
                        <Col >
                            <Form.Item name="hora" >
                                <Input type='number' placeholder='Cupo' value={descuento} onChange={(e) => setDescuento(e.target.value)} />
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