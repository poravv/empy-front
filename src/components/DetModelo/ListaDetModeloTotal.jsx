import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button, Image, Card, Carousel } from 'antd';
import { useNavigate } from "react-router-dom";

import { Buffer } from 'buffer';
const { Meta } = Card;

const URI = 'http://186.158.152.141:3002/automot/api/detmodelo';
const ListaModelo = ({ token, idsucursal }) => {


    const [data, setData] = useState([]);
    //---------------------------------------------------
    const navigate = useNavigate();
    //---------------------------------------------------


    useEffect(() => {
        getModelo();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getModelo = async () => {
        const res = await axios.get(`${URI}/gettotal/${idsucursal}`, config)
        console.log(res.data.body)
        setData(res.data.body);

    }

    const onChangeCarousel = (currentSlide) => {
        console.log(currentSlide);
    };

    const viewImage = (img) => {
        //console.log('Entra en view: ', img)
        if (img && typeof img !== "string") {
            //console.log(typeof img);
            const asciiTraducido = Buffer.from(img.data).toString('ascii');
            //console.log(asciiTraducido);
            if (asciiTraducido) {
                return (
                    <Image
                        style={{ border: `1px solid gray`, borderRadius: `4px` }}
                        alt="imagen"
                        //preview={false}
                        //style={{ width: '50%',margin:`0px`,textAlign:`center` }}
                        src={asciiTraducido}
                    />

                );
            } else {
                return null
            }
        } else {
            return null
        }
    }

    const viewEstado = (estado) => {
        //auto.estado.toUpperCase()==='VE' ? 'Vendido' : auto.estado.toUpperCase()==='DV' ? 'Devuelto' : 'Inactivo'
        if (estado === 'AC') return <div style={{ textAlign: `center` }}><p style={{ color: `green`,  borderRadius: `4px`,border: `1px solid green` }}>Activo</p></div>
        if (estado === 'VE') return <div style={{ textAlign: `center` }}><p style={{ color: `#418EDB`, borderRadius: `4px`, border: `1px solid #418EDB` }}>Vendido</p></div>
        if (estado === 'DV') return <div style={{ textAlign: `center` }}><p style={{ color: `orange`, borderRadius: `4px`,border: `1px solid orange` }}>Devuelto</p></div>
        if (estado === 'AC') return <div style={{ textAlign: `center` }}><p style={{ color: `red`, borderRadius: `4px`,border: `1px solid red` }}>Inactivo</p></div>
    }


    return (
        <>
            <h3>Total playa</h3>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button onClick={() => navigate('/detmodelo')} >Lista disponible</Button>
            </div>
            <div style={{ display:`flex`,flexWrap:`wrap` }}>
                {data ? data.map((auto, index) => {
                    return (
                        <Card
                            hoverable
                            key={index}
                            
                            style={{ width: 200,margin:`5px`,background:`#E8F0F7` }}
                            //cover={viewImage(auto.img)}
                            cover={<Carousel afterChange={onChangeCarousel}>
                                <div>
                                    {viewImage(auto.img)}
                                </div>
                                <div>
                                    {viewImage(auto.img1)}
                                </div>
                                <div>
                                    {viewImage(auto.img2)}
                                </div>
                            </Carousel>}
                        >
                            <Meta title={auto.modelo.descripcion} description={auto.costo} />

                            {auto.detalle}
                            <p>{auto.color}</p>
                            {viewEstado(auto.estado)}
                        </Card>
                    )
                }) : null}
            </div>
        </>
    )
}
export default ListaModelo;

//<TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idmodelo'} />
//auto.estado.toUpperCase()==='VE' ? 'Vendido' : auto.estado.toUpperCase()==='DV' ? 'Devuelto' : 'Inactivo'