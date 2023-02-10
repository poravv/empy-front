import React, { useState } from 'react';
import {
    //DesktopOutlined,
    //FileOutlined,
    HomeOutlined,
    TeamOutlined,
    ToolOutlined,
    LogoutOutlined,
    PieChartOutlined,
    FolderOpenOutlined,
    CheckSquareOutlined
} from '@ant-design/icons';
import { Layout, Menu, Image } from 'antd';
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Logout } from '../components/Utils/Logout';
import { Buffer } from 'buffer'

const { Header, Content, Footer, Sider } = Layout;

function getItem(onClick, label, key, icon, children) {
    return {
        onClick,
        key,
        icon,
        children,
        label
    };
}


const AppBar = ({ usuario, sucursal }) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    function navegacion(direccion) {
        navigate(direccion);
    }
    const traduccionImg = () => {
        
        if (sucursal) {
            //console.log(sucursal.body)
            if (sucursal.body.img && typeof sucursal.body.img !== "string") {
                //console.log(typeof img);
                const asciiTraducido = Buffer.from(sucursal.body.img.data).toString('ascii');
                //console.log(asciiTraducido);
                if (asciiTraducido) {
                    return (
                        <Image
                            style={{ border: `1px solid gray`, borderRadius: `4px`,maxHeight: `120px` }}
                            preview={false}
                            alt="imagen"
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

    }

    const items = [
        getItem(() => navegacion('/'), 'Home', '1', <HomeOutlined />),
        //getItem(() => navegacion('/tablemodel'), 'Option 2', '2', <DesktopOutlined />),
        getItem(null, 'Mantenimiento', 'sub1', <ToolOutlined />, [
            getItem(() => navegacion('/ciudad'), 'Ciudad', '2'),
            getItem(() => navegacion('/materia'), 'Materia', '3'),
            getItem(() => navegacion('/curso'), 'Curso', '4'),
            getItem(() => navegacion('/turno'), 'Turno', '5'),
            getItem(() => navegacion('/anhoLectivo'), 'Año Lectivo', '6'),
            getItem(() => navegacion('/documentos'), 'Documentos', '7'),
            getItem(() => navegacion('/sucursal'), 'Sucursal', '8'),
        ]),
        getItem(null, 'Academico', 'sub2', <FolderOpenOutlined />, [
            getItem(() => navegacion('/plan'), 'Planificacion', '9'),
            getItem(() => navegacion('/convocatoria'), 'Convocatoria', '10'),//Agregar aqui la asistencia, faltas y evaluaciones
            //getItem(() => navegacion('/inscripcion'), 'Inscripcion', '8'),
        ]),
        getItem(null, 'Administrativo', 'sub3', <TeamOutlined />, [
            getItem(() => navegacion('/instructor'), 'Instructores', '11'),
        ]),
        getItem(null, 'Gestion', 'sub4', <CheckSquareOutlined />, [
            getItem(() => navegacion('/cursosH'), 'Curso/Materia', '12'),
        ]),
        getItem(null, 'Reportes', 'sub5', <PieChartOutlined />, [
            getItem(() => navegacion('/'), 'Estadisticas', '13'),
            getItem(() => navegacion('/'), 'Informes', '14'),
        ]),
        getItem(() => Logout(), 'Close session', '15', <LogoutOutlined />)
    ];
    return (
        <Layout hasSider
            style={{
                minHeight: '100vh',
            }}
            theme="dark"
        >
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)} >

                

                <div className="logo" style={{ margin: `10px`, display: `flex`, alignItems: `center`, justifyContent: `center`, textAlign: `center` }} >
                    {traduccionImg()}
                </div>

                {
                    <Menu theme='dark' defaultSelectedKeys={['1']} mode="inline" items={items} />
                }
            </Sider>
            <Layout className="site-layout"
            >
                <Header
                    className="site-layout-background"
                    style={{ padding: 0, color: `white` }}
                >
                    <div style={{ marginLeft: `5px` }}>
                        Bienvenido de nuevo {usuario.usuario}
                    </div>
                </Header>

                <Content style={{ margin: '0 16px' }}  >
                    <div //className="site-layout-background"
                        style={{ padding: 24, minHeight: 360 }} >
                        <Outlet />
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center' }} >
                    ©2022 Created by Lic. Andrés Vera
                </Footer>
            </Layout>
        </Layout>
    );
};
export default AppBar;