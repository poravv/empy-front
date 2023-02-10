import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
//Importamos componentes creados
import ListaCiudad from '../components/Ciudad/ListaCiudad';
import NuevoCiudad from '../components/Ciudad/NuevoCiudad';

import ListaMateria from '../components/Materia/ListaMateria';
import NuevaMateria from '../components/Materia/NuevaMateria';
import ListaDocumentos from '../components/Documentos/ListaDocumentos';
import NuevoDocumentos from '../components/Documentos/NuevoDocumentos';

import ListaCurso from '../components/Curso/ListaCurso';
import NuevoCurso from '../components/Curso/NuevoCurso';

import Inicio from '../components/Inicio';
import NuevoDetModelo from '../components/DetModelo/NuevoDetModelo';
import ListaDetModelo from '../components/DetModelo/ListaDetModelo';
import ListaDetModeloTotal from '../components/DetModelo/ListaDetModeloTotal';
import ListaVenta from '../components/Venta/ListaVenta';
import NuevaVenta from '../components/Venta/NuevaVenta';
import AppBar from './AppBar';
import TableFormat from '../components/TableModel/Table';
import ListaInscripcion from '../components/Inscripcion/ListaInscripcion';
import NuevoInscripcion from '../components/Inscripcion/NuevoInscripcion';
import ReportePlaya from '../components/Reportes/ReportePlaya';
import ListaInstructores from '../components/Instructores/ListaInstructores';
import NuevoInstructores from '../components/Instructores/NuevoInstructores';
import Informes from '../components/Reportes/Informes';
import ListaTurno from '../components/Turno/ListaTurno';
import NuevoTurno from '../components/Turno/NuevoTurno';
import ListaPlan from '../components/Planificacion/ListaPlafinicacion';
import NuevoPlan from '../components/Planificacion/NuevaPlanificacion';
import ListaConvocatoria from '../components/Convocatoria/ListaConvocatoria';
import NuevoConvocatoria from '../components/Convocatoria/NuevaConvocatoria';
import ListaCursosH from '../components/CursosH/ListaCursosH';
import ListaAsistencia from '../components/Asistencia/ListaAsistencia';
import ListaFalta from '../components/Faltas/ListaFaltas';
import NuevoFalta from '../components/Faltas/NuevaFalta';
import ListaAnhoLectivo from '../components/AnhoLectivo/ListaAnhoLectivo';
import NuevoAnhoLectivo from '../components/AnhoLectivo/NuevoAnhoLectivo';

function NavRoute({ usuario }) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppBar usuario={usuario.body} />} >
            <Route index element={<Inicio idsucursal={usuario.body.idsucursal} token={usuario.token} usuario={usuario.body.usuario}/> }/>
            <Route path='/inicio' element={<Inicio idsucursal={usuario.body.idsucursal} token={usuario.token} usuario={usuario.body.usuario}/>} />
            {
              usuario.body.nivel === 1 ?
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

                  #Producto
                  <Route path='/detmodelo' element={<ListaDetModelo idsucursal={usuario.body.idsucursal} token={usuario.token} />} />
                  <Route path='/detmodelototal' element={<ListaDetModeloTotal idsucursal={usuario.body.idsucursal} token={usuario.token} />} />
                  <Route path='/creardetmodelo' element={<NuevoDetModelo idsucursal={usuario.body.idsucursal} idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  
                  #Modelo
                  <Route path='/instructor' element={<ListaInstructores token={usuario.token} />} />
                  <Route path='/crearcontrato' element={<NuevoInstructores token={usuario.token} />} />
                  #Turno
                  <Route path='/turno' element={<ListaTurno token={usuario.token} />} />
                  <Route path='/crearturno' element={<NuevoTurno token={usuario.token} />} />
                  #ReportePlaya
                  <Route path='/repomodelos' element={<ReportePlaya token={usuario.token} />} />
                  <Route path='/informes' element={<Informes token={usuario.token} />} />
                  <Route path='*' element={<Navigate replace to='/' />} />
                </>
                : null
            }
            
            #Inscripcion
            <Route path='/inscripcion/:idconvocatoria' element={<ListaInscripcion token={usuario.token} />} />
            <Route path='/crearinscripcion/:idconvocatoria' element={<NuevoInscripcion token={usuario.token} />} />
            #Planificacion
            <Route path='/plan' element={<ListaPlan token={usuario.token} />} />
            <Route path='/crearplan' element={<NuevoPlan token={usuario.token} />} />

            #Convocatoria
            <Route path='/convocatoria' element={<ListaConvocatoria token={usuario.token} />} />
            <Route path='/crearconvocatoria' element={<NuevoConvocatoria token={usuario.token} />} />

            #CursosH
            <Route path='/cursosH' element={<ListaCursosH token={usuario.token} />} />
            <Route path='/asistencia/:idconvocatoria' element={<ListaAsistencia token={usuario.token} />} />
            <Route path='/faltas/:idinscripcion' element={<ListaFalta token={usuario.token} />} />
            <Route path='/crearfalta' element={<NuevoFalta token={usuario.token} />} />
            
            <Route path='*' element={<Navigate replace to='/' />} />
            #Venta
            <Route path='/venta' element={<ListaVenta token={usuario.token} idusuario={usuario.body.idusuario} />} />
            <Route path='/crearventa' element={<NuevaVenta token={usuario.token} idusuario={usuario.body.idusuario} idsucursal={usuario.body.idsucursal} />} />
            #Table model
            <Route path='/tablemodel' element={<TableFormat title={'Formato'}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </> 
  )
}

export default NavRoute;
