
//Librerias
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Divider } from 'antd';
import Buscador from '../Utils/Buscador/Buscador';
import { Row, Col, message } from 'antd';
import { IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';
//Clases
import { getMateria } from '../../services/Materia';
import { getCurso } from '../../services/Curso';
import { createPlanificacion, getPlanificacion } from '../../services/Planificacion';
import { createDetPlanificacion } from '../../services/DetPlanificacion';
import { getUniqiueAnhoLectivo } from '../../services/AnhoLectivo';
import { getInstructor } from '../../services/Instructor';


let fechaActual = new Date();

function NuevoPlan({ token }) {
    //Variables 
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [tblplantmp, setTblPlanTmp] = useState([]);
    const [carga_horaria, setCargaHoraria] = useState(0);
    const [lstmateria, setLstMateria] = useState([]);
    const [lstcurso, setLstCurso] = useState([]);
    const [lstPlan, setLstPlan] = useState([]);
    const [materiaSelect, setMateriaSelect] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [idcurso, setIdCurso] = useState();
    const [instructorSelect, setInstructorSelect] = useState();
    const [idanho_lectivo, setIdAnhoLectivo] = useState();
    const [instructores, setInstructores] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        getLstMateria();
        getLstCurso();
        getLstPlan();
        getLstInstructor();
        getAnhoLectivo();
        // eslint-disable-next-line
    }, []);

    const getLstMateria = async () => {
        const res = await getMateria({ token: token, param: 'get' });
        setLstMateria(res.body);
    }

    const getLstInstructor = async () => {
        const res = await getInstructor({ token: token, param: 'get' });
        let array = [];
        res.body.map((inst) =>{
            inst.nombres= inst.persona.nombre+' '+inst.persona.apellido;
            //console.log(inst);
            array.push(inst);
            return true;
        }
        )
        setInstructores(array);
    }
    const getLstPlan = async () => {
        const res = await getPlanificacion({ token: token, param: 'get' });
        setLstPlan(res.body);
    }

    const getAnhoLectivo = async () => {
        const res = await getUniqiueAnhoLectivo({ token: token});
        //console.log(res.body[0].idanho_lectivo)
        setIdAnhoLectivo(res.body[0].idanho_lectivo);
    }

    const getLstCurso = async () => {
        const res = await getCurso({ token: token, param: 'get' });
        setLstCurso(res.body);
    }


    const guardaCab = async (valores) => {
        console.log(valores)
        return await createPlanificacion({ token: token, json: valores });
        //navigate('/plan');
    }

    const guardaDetalle = async (valores) => {
        return await createDetPlanificacion({ token: token, json: valores });
    }

    //procedimiento para guardar
    const gestionGuardado = async () => {
        //e.preventDefault();
        let validExist = false;

        /*Validacion de existencia de curso con anho lectivo*/
        lstPlan.map((plan)=> {
            if(plan.idcurso===idcurso&&plan.idanho_lectivo===idanho_lectivo){
                validExist=true;
            }
            return true;
        });

        if(validExist) {
            message.error('El curso ya existe para el año lectivo');
            return;
        };

        try {
            guardaCab({
                fecha: strFecha,
                estado: 'AC',
                idanho_lectivo:idanho_lectivo,
                idcurso:idcurso,
                }
            ).then((cabecera) => {
                try {
                    //Guardado del detalle
                    tblplantmp.map((detplan) => {
                        console.log(detplan);
                        //console.log('iddet_modelo: ', plan.detmodelo.iddet_modelo)
                        guardaDetalle({
                            carga_horaria:carga_horaria,
                            descripcion:descripcion,
                            estado: 'AC',
                            idmateria: detplan.materia.idmateria,
                            idplanificacion: cabecera.body.idplanificacion,
                            idinstructor:detplan.instructor.idinstructor
                        });
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
        //console.log(materiaSelect);
        let validExist=false;

         tblplantmp.filter((inv) => {
            if(inv.idmateria === materiaSelect.idmateria){
                validExist=true;
                return true
            }
            return true;
        }
            );
        if (validExist===false){
            /*Tabla temporal*/
            const updtblPlan = { idmateria:materiaSelect.idmateria, materia: materiaSelect,instructor: instructorSelect, carga_horaria: carga_horaria, descripcion: descripcion, };
            /*Se va sumando los valores que se van cargando*/
            setTblPlanTmp([...tblplantmp,updtblPlan])
            message.success('Agregado');
        } else {
            message.warning('Materia ya existe');
        }
        validExist=false;
    }


    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/plan');
    }

    const onChangeCurso = (value) => {
        setIdCurso(value)
    };
    
    const onChangeMateria = (value) => {
        lstmateria.find((element) => {
            if (element.idmateria === value) {
                setMateriaSelect(element)
                return true;
            } else {
                return false;
            }
        });
    };

    const onChangeInstructor = (value) => {
        instructores.find((element) => {
            if (element.idinstructor === value) {
                setInstructorSelect(element)
                return true;
            } else {
                return false;
            }
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const extraerRegistro = async (e, id) => {
        e.preventDefault();
        //console.log('Datos: ',costo,monto_iva)
        const updtblPlan = tblplantmp.filter(inv => inv.idmateria !== id);
        setTblPlanTmp(updtblPlan);
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
                    <Divider orientation="center" type="horizontal" style={{ color: `#747E87` }}>Cabecera</Divider>
                    <Row style={{ justifyContent: `center` }}>
                        <Col style={{ marginLeft: `15px`, marginTop: `5px` }}>
                            <Buscador label={'descripcion'} title={'Curso'} value={'idcurso'} data={lstcurso} onChange={onChangeCurso} onSearch={onSearch} />
                        </Col>
                    </Row>
                    <Divider orientation="center" type="horizontal" style={{ color: `#747E87` }}>Carga de detalle</Divider>
                    <Row style={{ justifyContent: `center` }}>
                        <Col style={{ marginLeft: `15px` }}>
                            <Buscador label={'descripcion'} title={'Materia'} value={'idmateria'} data={lstmateria} onChange={onChangeMateria} onSearch={onSearch} />
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Buscador label={'nombres'} title={'Instructor'} value={'idinstructor'} data={instructores} onChange={onChangeInstructor} onSearch={onSearch} />
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="hora" >
                                <Input type='number' placeholder='Carga horaria' value={carga_horaria} onChange={(e) => setCargaHoraria(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="descripcion" >
                                <Input placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
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
                            <thead style={{ backgroundColor: `#03457F`, color: `white` }}>
                                <tr >
                                    <th>Materia</th>
                                    <th>Carga horaria</th>
                                    <th>Instructor</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tblplantmp.length !== 0 ? tblplantmp.map(inv => (
                                    <tr key={inv.idmateria}>
                                        <td> {inv.materia.descripcion} </td>
                                        <td> {inv.carga_horaria} </td>
                                        <td> {instructorSelect.nombres} </td>
                                        <td>
                                            <button onClick={(e) => extraerRegistro(e, inv.idmateria)} className='btn btn-danger'><IoTrashOutline /></button>
                                        </td>
                                    </tr>
                                )) : null
                                }
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