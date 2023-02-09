import ReporteModelos from "./TemplateReporte";
import ReporteLine from "./TemplateReporteLine";
import axios from 'axios';
import { useEffect, useState } from 'react';

const URIMODELO = 'http://186.158.152.141:3002/automot/api/detmodelo';
const URIVENTA = 'http://186.158.152.141:3002/automot/api/venta';

const ReportePlaya = ({ token }) => {

    //console.log(token)
    //const [mma, setMma] = useState([]);
    const [marca, setMarca] = useState([]);
    const [modelo, setModelo] = useState([]);
    const [ventamarca, setVentamarca] = useState([]);
    const [ventamodelo, setVentamodelo] = useState([]);

    useEffect(() => {
        getEstadistica();
        getEstadisticaVenta();
        // eslint-disable-next-line
    }, []);

    const configToken = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };


    const getEstadistica = async () => {
        const res = await axios.get(`${URIMODELO}/getestadistica/`, configToken)
        console.log(res.data.body);
        //let mma = [];
        let marca = [];
        let modelo = [];
        res.data.body.map((valor) => {
            //if (valor.obs === 'mma') mma.push(valor)
            if (valor.obs === 'marca') marca.push(valor)
            if (valor.obs === 'modelo') modelo.push(valor)
            return true;
        })
        setMarca(marca);
        setModelo(modelo);
        //setMma(mma);
    }

    const getEstadisticaVenta = async () => {
        const res = await axios.get(`${URIVENTA}/getestadistica/`, configToken)
        console.log(res.data.body);
        let ventaModelo =[];
        let ventaMarca =[];

        res.data.body.map((valor) => {
            if (valor.obs === 'vmo') ventaModelo.push(valor)
            if (valor.obs === 'vma') ventaMarca.push(valor)
            return true;
        })
        
        setVentamodelo(ventaModelo);
        setVentamarca(ventaMarca);
    }

    return (
        <>
            <h2>Estadisticas</h2>
            <div style={{ textAlign:`center` }}>
            <h3>Playa</h3>
            </div>
            <div style={{ display:`flex`, flexWrap:`wrap`}}>
                <div style={{margin:`0px`}}>
                <ReporteModelos data={marca} title={'Marca'} />
                </div>
                <div style={{margin:`0px`}}>
                <ReporteModelos data={modelo} title={'Modelo'} />
                </div>
            </div>
            <div>
                <p>Venta por modelo</p>
                <ReporteLine data={ventamodelo} xField={'mes'} cantidad={'cantidad'} descripcion={'modelo'} />
                <p>Venta por marca</p>
                <ReporteLine data={ventamarca} xField={'mes'} cantidad={'cantidad'} descripcion={'modelo'} />
            </div>
        </>
    );
};

export default ReportePlaya;
//xField: 'mes',yField: ['marca', 'cantidad'],