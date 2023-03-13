import axios from 'axios';

const baseURL = 'http://186.158.152.141:4000/empy/api/usuario/login/';

const Login = async (credentials) => {
    const { data } = await axios.post(baseURL, credentials);
    return data;
}

export default Login;