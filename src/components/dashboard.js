import React from 'react';
import { Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const DashboardPage = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: 'transparent', padding: '20px', textAlign: 'center' }}>
        <img src="espe.png" alt="Logo" style={{ maxWidth: '500px', maxHeight: '500px' }} />
      </Header>
      <Content style={{ padding: '50px', textAlign: 'center' }}>
        <Title level={1}>SISTEMA INVENTARIO BODEGA</Title>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: '20px' }}>
          <img src="logo512.png" alt="React Logo" style={{ width: '100px', height: '100px', margin: '0 20px', animation: 'spin 5s linear infinite' }} />
          <Title style={{ color: '#2E2E2E', fontSize: '35px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', marginBottom: 0 }}>React + Supabase</Title>
          <img src="logo375.svg" alt="Supabase Logo" style={{ width: '100px', height: '100px', margin: '0 20px', animation: 'spin 5s linear infinite' }} />
        </div>
        <Title level={2}>EXAMEN PARCIAL II</Title><br/>
        <p style={{ fontSize: '20px' }}>NOMBRE: ADRIAN SIMBAÑA</p>
        <p style={{ fontSize: '20px' }}>NRC: 14386</p>
        <p style={{ fontSize: '20px' }}>FECHA: 08/02/2024</p>
      </Content>
    </Layout>
  );
}

export default DashboardPage;
