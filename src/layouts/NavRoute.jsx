import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ListaCiudad from '../components/Referenciales/Ciudad/ListaCiudad';
import NuevoCiudad from '../components/Referenciales/Ciudad/NuevoCiudad';
import ListaMateria from '../components/Referenciales/Materia/ListaMateria';
import NuevaMateria from '../components/Referenciales/Materia/NuevaMateria';
import ListaDocumentos from '../components/Referenciales/Documentos/ListaDocumentos';
import NuevoDocumentos from '../components/Referenciales/Documentos/NuevoDocumentos';
import ListaCurso from '../components/Referenciales/Curso/ListaCurso';
import NuevoCurso from '../components/Referenciales/Curso/NuevoCurso';
import ListaTurno from '../components/Referenciales/Turno/ListaTurno';
import NuevoTurno from '../components/Referenciales/Turno/NuevoTurno';
import ListaGradosArma from '../components/Referenciales/GradosArma/ListaGradosArma';
import NuevoGradosArma from '../components/Referenciales/GradosArma/NuevaGradosArma';
import ListaAnhoLectivo from '../components/Referenciales/AnhoLectivo/ListaAnhoLectivo';
import NuevoAnhoLectivo from '../components/Referenciales/AnhoLectivo/NuevoAnhoLectivo';
import NuevaSucursal from '../components/Referenciales/Sucursal/NuevaSucursal';
import ListaSucursal from '../components/Referenciales/Sucursal/ListaSucursal';


import ListaInstructores from '../components/Administrativo/Instructores/ListaInstructores';
import NuevoInstructores from '../components/Administrativo/Instructores/NuevoInstructores';


import Inicio from '../components/Inicio';
import ListaVenta from '../components/Venta/ListaVenta';
import NuevaVenta from '../components/Venta/NuevaVenta';
import AppBar from './AppBar';
import TableFormat from '../components/TableModel/Table';
import ListaInscripcion from '../components/Academico/Inscripcion/ListaInscripcion';
import NuevoInscripcion from '../components/Academico/Inscripcion/NuevoInscripcion';
import ReportePlaya from '../components/Reportes/ReportePlaya';
import Informes from '../components/Reportes/Informes';
import ListaPlan from '../components/Planificacion/ListaPlafinicacion';
import NuevoPlan from '../components/Planificacion/NuevaPlanificacion';
import ListaConvocatoria from '../components/Convocatoria/ListaConvocatoria';
import NuevoConvocatoria from '../components/Convocatoria/NuevaConvocatoria';
import ListaGestion from '../components/Gestion/ListaGestion';
import ListaAsistencia from '../components/Gestion/Asistencia/ListaAsistencia';
import ListaFalta from '../components/Faltas/ListaFaltas';
import NuevoFalta from '../components/Faltas/NuevaFalta';
import ListaPersona from '../components/Academico/Persona/ListaPersona';
import NuevoPersona from '../components/Academico/Persona/NuevaPersona';
import ListaUsuario from '../components/Gestion/Usuario/ListaUsuario';
import NuevoUsuario from '../components/Gestion/Usuario/NuevoUsuario';
import ListaProceso from '../components/Gestion/Procesos/ListaProceso';
import NuevaAsistencia from '../components/Gestion/Asistencia/NuevaAsistencia';
import AsistenciaDetalle from '../components/Gestion/Asistencia/AsistenciaDetalle';

function NavRoute({ usuario, sucursal }) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppBar usuario={usuario.body} sucursal={sucursal} />} >
            <Route index element={<Inicio idsucursal={usuario.body.idsucursal} token={usuario.token} usuario={usuario.body.usuario} />} />
            <Route path='/inicio' element={<Inicio idsucursal={usuario.body.idsucursal} token={usuario.token} usuario={usuario.body.usuario} />} />
            {
              (usuario.body.nivel === 1||usuario.body.nivel === 0) ?
                <>
                  #Ciudad
                  <Route path='/ciudad' element={<ListaCiudad token={usuario.token} />} />
                  <Route path='/crearciudad' element={<NuevoCiudad token={usuario.token} />} />
                  #Materia
                  <Route path='/materia' element={<ListaMateria token={usuario.token} />} />
                  <Route path='/crearmateria' element={<NuevaMateria token={usuario.token} />} />
                  #Curso
                  <Route path='/curso' element={<ListaCurso token={usuario.token} />} />
                  <Route path='/crearcurso' element={<NuevoCurso token={usuario.token} />} />
                  #Anho Lectivo
                  <Route path='/anhoLectivo' element={<ListaAnhoLectivo token={usuario.token} />} />
                  <Route path='/crearanhoLectivo' element={<NuevoAnhoLectivo token={usuario.token} />} />
                  #Documentos
                  <Route path='/documentos' element={<ListaDocumentos token={usuario.token} />} />
                  <Route path='/creardocumentos' element={<NuevoDocumentos token={usuario.token} />} />
                  #Sucursal
                  <Route path='/sucursal' element={<ListaSucursal idsucursal={usuario.body.idsucursal} token={usuario.token} />} />
                  <Route path='/crearsucursal' element={<NuevaSucursal idsucursal={usuario.body.idsucursal} idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  #GradosArma
                  <Route path='/gradosArma' element={<ListaGradosArma token={usuario.token} />} />
                  <Route path='/creargradosArma' element={<NuevoGradosArma token={usuario.token} />} />
                  #Turno
                  <Route path='/turno' element={<ListaTurno token={usuario.token} />} />
                  <Route path='/crearturno' element={<NuevoTurno token={usuario.token} />} />
                  #Instructor
                  <Route path='/instructor' element={<ListaInstructores token={usuario.token} />} />
                  <Route path='/crearinstructor' element={<NuevoInstructores token={usuario.token} />} />
                  #ReportePlaya
                  <Route path='/repomodelos' element={<ReportePlaya token={usuario.token} />} />
                  <Route path='/informes' element={<Informes token={usuario.token} />} />
                  <Route path='*' element={<Navigate replace to='/' />} />
                  #Persona
                  <Route path='/persona' element={<ListaPersona token={usuario.token} />} />
                  <Route path='/crearpersona' element={<NuevoPersona token={usuario.token} />} />
                  #Usuario
                  <Route path='/usuario' element={<ListaUsuario token={usuario.token} />} />
                  <Route path='/crearusuario' element={<NuevoUsuario token={usuario.token} />} />
                </>
                : null
            }
            {
              usuario.body.nivel === 2||usuario.body.nivel === 0 ?
                <>
                  #Inscripcion
                  < Route path='/inscripcion/:idconvocatoria' element={<ListaInscripcion token={usuario.token} />} />
                  <Route path='/crearinscripcion/:idconvocatoria' element={<NuevoInscripcion token={usuario.token} />} />
                  #Planificacion
                  <Route path='/plan' element={<ListaPlan token={usuario.token} />} />
                  <Route path='/crearplan' element={<NuevoPlan token={usuario.token} />} />
                  #Convocatoria
                  <Route path='/convocatoria' element={<ListaConvocatoria token={usuario.token} />} />
                  <Route path='/crearconvocatoria' element={<NuevoConvocatoria token={usuario.token} />} />
                  #CursosH
                  <Route path='/gestion' element={<ListaGestion token={usuario.token} usuario={usuario.body} />} />
                  <Route path='/proceso/:idconvocatoria/:idmateria' element={<ListaProceso token={usuario.token} usuario={usuario.body} />} />
                  <Route path='/asistencia/:iddet_planificacion' element={<ListaAsistencia token={usuario.token} />} />
                  <Route path='/crearasistencia/:iddet_planificacion' element={<NuevaAsistencia token={usuario.token} />} />
                  <Route path='/asistenciadetalle/:idasistencia' element={<AsistenciaDetalle token={usuario.token} />} />

                  <Route path='/faltas/:idinscripcion' element={<ListaFalta token={usuario.token} />} />
                  <Route path='/crearfalta' element={<NuevoFalta token={usuario.token} />} />
                  <Route path='*' element={<Navigate replace to='/' />} />
                  #Venta
                  <Route path='/venta' element={<ListaVenta token={usuario.token} idusuario={usuario.body.idusuario} />} />
                  <Route path='/crearventa' element={<NuevaVenta token={usuario.token} idusuario={usuario.body.idusuario} idsucursal={usuario.body.idsucursal} />} />
                </>
                : null
            }

            #Table model
            <Route path='/tablemodel' element={<TableFormat title={'Formato'} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default NavRoute;
