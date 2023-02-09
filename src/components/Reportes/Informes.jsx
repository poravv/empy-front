
import { useEffect, useState } from 'react'
import axios from "axios";
import React from 'react';
import { Button } from 'antd';
import * as XLSX from 'xlsx/xlsx.mjs';

const URI = 'http://186.158.152.141:3002/automot/api/detmodelo';

function Informes({token}) {
    const [detmodelo, setDetModelo] = useState([])

    useEffect(() => {
        getDetModelo();
        // eslint-disable-next-line
    }, []);

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getDetModelo = async () => {
        const res = await axios.get(`${URI}/getinfoplaya`, config);
        
        console.log(res.data.body);

        setDetModelo(res.data.body);
    }

    const handleExport = () => {
        var wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet(detmodelo);
        XLSX.utils.book_append_sheet(wb, ws, 'Playa');
        XLSX.writeFile(wb, 'Playa.xlsx')
    }

    return (
        <>
        <h2>Informes</h2>
        <Button onClick={handleExport}>Total Playa</Button>
        </>
    );
}

export default Informes;