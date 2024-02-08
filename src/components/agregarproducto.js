import { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Table, Space, message } from 'antd';
import { supabase } from '../supabase';
import moment from 'moment';

const { Option } = Select;

const AgregarProducto = () => {
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMarcas();
    fetchCategorias();
    fetchProductos();
  }, []);

  const fetchMarcas = async () => {
    try {
      const { data, error } = await supabase.from('marcas').select('*');
      if (error) {
        throw error;
      }
      setMarcas(data || []);
    } catch (error) {
      console.error('Error fetching marcas:', error.message);
    }
  };

  const fetchCategorias = async () => {
    try {
      const { data, error } = await supabase.from('categorias').select('*');
      if (error) {
        throw error;
      }
      setCategorias(data || []);
    } catch (error) {
      console.error('Error fetching categorias:', error.message);
    }
  };

  const fetchProductos = async () => {
    try {
      const { data, error } = await supabase.from('productos').select('*');
      if (error) {
        throw error;
      }
      setProductos(data || []);
    } catch (error) {
      console.error('Error fetching productos:', error.message);
    }
  };

  const handleAgregarProducto = async (values) => {
    try {
      const { data, error } = await supabase.from('productos').insert(values);
      if (error) {
        throw error;
      }
      form.resetFields();
      fetchProductos();
      message.success('Producto agregado exitosamente.');
    } catch (error) {
      console.error('Error adding producto:', error.message);
      message.error('Hubo un error al agregar el producto.');
    }
  };

  const handleIncrementarCantidad = async (id, cantidad) => {
    try {
      const { data, error } = await supabase.from('productos').update({ cantidad: cantidad + 20 }).eq('id', id);
      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        fetchProductos();
        message.success('Cantidad aumentada exitosamente.');
      }
    } catch (error) {
      console.error('Error incrementing cantidad:', error.message);
      message.error('Hubo un error al aumentar la cantidad del producto.');
    }
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
    {
      title: 'Fecha y Hora Modificación',
      dataIndex: 'fechaHora',
      key: 'fechaHora',
      render: (text, record) => (
        <span>{moment(record.fechaHora).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: 'Ingreso Mercadería',
      key: 'acciones',
      render: (text, record) => (
        <Space>
          {/* <Input
            type="text"
            style={{ width: 70, marginRight: 10 }}
            onChange={(e) => handleIncrementarCantidad(record.id, parseInt(e.target.value))}
          /> */}
          <Button type="primary" onClick={() => handleIncrementarCantidad(record.id, record.cantidad)}>Agregar (+20)</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} onFinish={handleAgregarProducto} layout="vertical">
        <Form.Item label="Tipo" name="nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Precio" name="precio" rules={[{ required: true, message: 'Por favor ingrese el precio del producto' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Marca" name="marca_id" rules={[{ required: true, message: 'Por favor seleccione la marca' }]}>
          <Select placeholder="Seleccione una marca">
            {marcas.map(marca => (
              <Option key={marca.id} value={marca.id}>{marca.nombre}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Nombre" name="descripcion">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Color" name="color">
          <Input />
        </Form.Item>
        <Form.Item label="Cantidad" name="cantidad" rules={[{ required: true, message: 'Por favor ingrese la cantidad del producto' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Categoría" name="categoria_id" rules={[{ required: true, message: 'Por favor seleccione la categoría' }]}>
          <Select placeholder="Seleccione una categoría">
            {categorias.map(categoria => (
              <Option key={categoria.id} value={categoria.id}>{categoria.nombre}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Agregar Producto</Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={productos} pagination={false} />
    </div>
  );
};

export default AgregarProducto;
