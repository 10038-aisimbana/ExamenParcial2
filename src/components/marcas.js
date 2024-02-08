import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Space } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '../supabase';
import html2pdf from 'html2pdf.js';

const Marcas = () => {
  const [marcas, setMarcas] = useState([]);
  const [originalMarcas, setOriginalMarcas] = useState([]); // Agregar estado para almacenar los datos originales
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedMarca, setSelectedMarca] = useState(null);

  useEffect(() => {
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('marcas').select('*');
      if (error) {
        throw error;
      }
      setMarcas(data || []);
      setOriginalMarcas(data || []);
    } catch (error) {
      console.error('Error fetching marcas:', error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAddMarca = async (values) => {
    try {
      const { data, error } = await supabase.from('marcas').insert(values).single();
      if (error) {
        throw error;
      }
      setVisible(false);
      form.resetFields();
      fetchMarcas();
    } catch (error) {
      console.error('Error adding marca:', error.message);
    }
  };

  const handleEditMarca = async () => {
    try {
      const values = await form.validateFields();
      const { error } = await supabase.from('marcas').update(values).eq('id', selectedMarca.id);
      if (error) {
        throw error;
      }
      setVisible(false);
      form.resetFields();
      fetchMarcas();
    } catch (error) {
      console.error('Error updating marca:', error.message);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'País', dataIndex: 'pais', key: 'pais' },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (text, record) => (
        <Button.Group>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Editar</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Eliminar</Button>
          {/* <Button icon={<InfoCircleOutlined />} onClick={() => handleDetails(record)}>Detalles</Button> */}
        </Button.Group>
      ),
    },
  ];

  const handleEdit = (marca) => {
    setSelectedMarca(marca);
    setVisible(true);
    form.setFieldsValue(marca);
  };

  const handleDelete = async (marcaId) => {
    try {
      const { error } = await supabase.from('marcas').delete().eq('id', marcaId);
      if (error) {
        throw error;
      }
      fetchMarcas();
    } catch (error) {
      console.error('Error deleting marca:', error.message);
    }
  };

  /*const handleDetails = (marca) => {
    console.log('Detalles de marca:', marca);
  };*/

  const handleSearch = (value) => {
    const filteredMarcas = originalMarcas.filter(marca =>
      Object.values(marca).some(val => typeof val === 'string' && val.toLowerCase().includes(value.toLowerCase()))
    );
    setMarcas(filteredMarcas);
  };
  

  const handleDownloadPDF = () => {
    const table = document.getElementById('marcas-table');
    html2pdf().from(table).save();
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<PlusOutlined />} onClick={() => setVisible(true)}>Agregar Marca</Button>
        <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Descargar PDF</Button>
        <Input.Search placeholder="Buscar marca" onSearch={handleSearch} enterButton />
      </Space>
      <Table id="marcas-table" columns={columns} dataSource={marcas} loading={loading} />
      <Modal
        title="Agregar/Editar Marca"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>Cancelar</Button>,
          selectedMarca ? (
            <Button key="edit" type="primary" onClick={handleEditMarca}>Editar</Button>
          ) : (
            <Button key="add" type="primary" onClick={() => form.submit()}>Agregar</Button>
          ),
        ]}
      >
        <Form form={form} onFinish={selectedMarca ? handleEditMarca : handleAddMarca} layout="vertical">
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre de la marca' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="País" name="pais" rules={[{ required: true, message: 'Por favor ingrese el país de la marca' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Marcas;
