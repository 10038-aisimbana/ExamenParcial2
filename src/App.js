import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, ShoppingCartOutlined, LogoutOutlined, PlusOutlined, MinusOutlined, TagsOutlined, BarsOutlined  } from '@ant-design/icons';
import Productos from './components/productos';
import Marcas from './components/marcas';
import Categorias from './components/categorias';
import DashboardPage from './components/dashboard';
import AgregarProducto from './components/agregarproducto';
import SalidaProductos from './components/salidaproductos';

const { Sider, Content } = Layout;

const Dashboard = () => {
  const [componenteActivo, setComponenteActivo] = useState('Inicio');
  const renderizarComponente = () => {
    switch (componenteActivo) {
      case 'Productos':
        return <Productos />;
      case 'Marcas':
        return <Marcas />;
      case 'Categorias':
        return <Categorias />;
      case 'AgregarProducto':
          return <AgregarProducto />;
      case 'SalidaProductos':
         return <SalidaProductos />;
      default:
        return <DashboardPage/>;
    }
  };

  const handleMenuClick = (componente) => {
    setComponenteActivo(componente);
  };

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <h1 style={{ textAlign: 'center', fontSize: '24px', margin: '20px 0', color: 'white' }}>Bienvenido</h1>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => handleMenuClick('Inicio')}>
              Inicio
            </Menu.Item>
            <Menu.Item key="2" icon={<ShoppingCartOutlined />} onClick={() => handleMenuClick('Productos')}>
              Productos
            </Menu.Item>
            <Menu.Item key="3" icon={<TagsOutlined />} onClick={() => handleMenuClick('Marcas')}>
              Marcas
            </Menu.Item>
            <Menu.Item key="6" icon={<BarsOutlined />} onClick={() => handleMenuClick('Categorias')}>
              Categorías
            </Menu.Item>
            <Menu.Item key="4" icon={<PlusOutlined />} onClick={() => handleMenuClick('AgregarProducto')}>
              Ingreso de Productos
            </Menu.Item>
            <Menu.Item key="5" icon={<MinusOutlined />} onClick={() => handleMenuClick('SalidaProductos')}>
              Salida de Productos
            </Menu.Item>       
          </Menu>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
            <Menu theme="dark" mode="inline">
              <Menu.Item key="6" icon={<LogoutOutlined />}>
                Salir
              </Menu.Item>
            </Menu>
          </div>
        </Sider>
        <Layout>
          <Content style={{ padding: '24px' }}>
            {renderizarComponente()}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
