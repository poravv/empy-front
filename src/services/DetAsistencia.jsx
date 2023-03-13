import axios from 'axios';

const baseURL = 'http://186.158.152.141:4000/empy/api/det_asistencia';

export const getDetAsistencia = async ({token,param}) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/get`, config)
    return data;
};

export const getDetalleId = async ({token,param}) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    //const { data } = await axios.get(baseURL, credentials);
    const { data } = await axios.get(`${baseURL}/getdetalle/${param}`, config)
    return data;
};


export const deleteDetAsistencia  = async ({token,param}) => {
    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    const { data } = await axios.delete(`${baseURL}/del/${param}`, config)
    return data;
};

export const updateDetAsistencia  = async ({token,param,json}) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };
    const { data } = await axios.put(baseURL + "/put/" + param, json, config)
    return data;
};

export const createDetAsistencia  = async ({token,json}) => {
    //console.log(json)
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    await axios.post(baseURL + "/post/", json, config)
    return true;
};