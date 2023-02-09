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
import { Layout, Menu,Image } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '../logoprueba.png';
import { useNavigate } from "react-router-dom";
import { Logout } from '../components/Utils/Logout';

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




const AppBar = ({ usuario }) => {

    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);

    function navegacion(direccion) {
        navigate(direccion);
    }

    const items = [
        getItem(() => navegacion('/'), 'Home', '1', <HomeOutlined />),
        //getItem(() => navegacion('/tablemodel'), 'Option 2', '2', <DesktopOutlined />),
        getItem(null, 'Mantenimiento', 'sub1', <ToolOutlined />, [
            getItem(() => navegacion('/ciudad'), 'Ciudad', '2'),
            getItem(() => navegacion('/'), 'Materia', '3'),
            getItem(() => navegacion('/'), 'Curso', '4'),
            getItem(() => navegacion('/turno'), 'Turno', '5'),
        ]),
        getItem(null, 'Academico', 'sub2', <FolderOpenOutlined />, [
            getItem(() => navegacion('/plan'), 'Planificacion', '6'),
            getItem(() => navegacion('/convocatoria'), 'Convocatoria', '7'),//Agregar aqui la asistencia, faltas y evaluaciones
            //getItem(() => navegacion('/inscripcion'), 'Inscripcion', '8'),
        ]),
        getItem(null, 'Administrativo', 'sub3', <TeamOutlined />, [
            getItem(() => navegacion('/instructor'), 'Instructores', '9'),
        ]),
        getItem(null, 'Gestion', 'sub4', <CheckSquareOutlined />, [
            getItem(() => navegacion('/cursosH'), 'Curso/Materia', '10'),
        ]),
        getItem(null, 'Reportes', 'sub5', <PieChartOutlined />, [
            getItem(() => navegacion('/'), 'Estadisticas', '11'),
            getItem(() => navegacion('/'), 'Informes', '12'),
        ]),
        getItem(() => Logout(), 'Close session', '13', <LogoutOutlined />)
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
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="logo" style={{ margin:`10px`,display:`flex`,alignItems:`center`,justifyContent:`center`,textAlign:`center` }} >
                    <Image style={{maxHeight:`120px` }} src={logo} alt={'logo'} preview={false} />
                </div>
                {
                    <Menu theme='dark' defaultSelectedKeys={['1']} mode="inline" items={items} />
                }
            </Sider>
            <Layout className="site-layout"
            >
                <Header
                    className="site-layout-background"
                    style={{padding: 0,color: `white`}} 
                    >
                    <div style={{ marginLeft: `5px` }}>
                        Bienvenido de nuevo {usuario.nick}
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