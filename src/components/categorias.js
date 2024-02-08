import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '../supabase';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categorias').select('*');
      if (error) {
        throw error;
      }
      setCategorias(data || []);
    } catch (error) {
      console.error('Error fetching categorias:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategoria = async (values) => {
    try {
      const { data, error } = await supabase.from('categorias').insert(values).single();
      if (error) {
        throw error;
      }
      setVisible(false);
      form.resetFields();
      fetchCategorias();
    } catch (error) {
      console.error('Error adding categoria:', error.message);
    }
  };

  const handleEditCategoria = async () => {
    try {
      const values = await form.validateFields();
      const { error } = await supabase.from('categorias').update(values).eq('id', selectedCategoria.id);
      if (error) {
        throw error;
      }
      setVisible(false);
      form.resetFields();
      fetchCategorias();
    } catch (error) {
      console.error('Error updating categoria:', error.message);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (text, record) => (
        <Button.Group>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Editar</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Eliminar</Button>
        </Button.Group>
      ),
    },
  ];

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setVisible(true);
    form.setFieldsValue(categoria);
  };

  const handleDelete = async (categoriaId) => {
    try {
      const { error } = await supabase.from('categorias').delete().eq('id', categoriaId);
      if (error) {
        throw error;
      }
      fetchCategorias();
    } catch (error) {
      console.error('Error deleting categoria:', error.message);
    }
  };

  return (
    <div>
      <Button icon={<PlusOutlined />} onClick={() => setVisible(true)}>Agregar Categoría</Button>
      <Table columns={columns} dataSource={categorias} loading={loading} />
      <Modal
        title="Agregar/Editar Categoría"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>Cancelar</Button>,
          selectedCategoria ? (
            <Button key="edit" type="primary" onClick={handleEditCategoria}>Editar</Button>
          ) : (
            <Button key="add" type="primary" onClick={() => form.submit()}>Agregar</Button>
          ),
        ]}
      >
        <Form form={form} onFinish={selectedCategoria ? handleEditCategoria : handleAddCategoria} layout="vertical">
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre de la categoría' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categorias;
