import { useState, useEffect } from 'react';
import { Table, InputNumber, Button, message, List } from 'antd';
import { supabase } from '../supabase';

const SalidaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    fetchProductos();
    fetchTransacciones();
  }, []);

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

  const fetchTransacciones = async () => {
    try {
      const { data, error } = await supabase.from('transacciones').select('*');
      if (error) {
        throw error;
      }
      setTransacciones(data || []);
    } catch (error) {
      console.error('Error fetching transacciones:', error.message);
    }
  };

  const handleSalidaMercancia = async (id, cantidadSalida) => {
    try {
      const producto = productos.find(p => p.id === id);
      if (!producto) {
        throw new Error('Producto no encontrado.');
      }
      const nuevaCantidad = producto.cantidad - cantidadSalida;
      if (nuevaCantidad < 0) {
        throw new Error('La cantidad a salir es mayor que la cantidad disponible.');
      }
      const { error } = await supabase
        .from('productos')
        .update({ cantidad: nuevaCantidad })
        .eq('id', id);
      if (error) {
        throw error;
      }
      await supabase.from('transacciones').insert({
        producto_id: id,
        cantidad: cantidadSalida,
        fecha_hora: new Date().toISOString()
      });
      message.success('Salida de mercancía registrada exitosamente.');
      fetchProductos(); 
      fetchTransacciones(); 
    } catch (error) {
      console.error('Error al registrar salida de mercancía:', error.message);
      message.error('Hubo un error al registrar la salida de mercancía.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Precio', dataIndex: 'precio', key: 'precio' },
    { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
    {
      title: 'Cantidad a salir',
      dataIndex: 'cantidad_salida',
      key: 'cantidad_salida',
      render: (_, record) => (
        <InputNumber min={0} max={record.cantidad} defaultValue={0} onChange={(value) => record.cantidad_salida = value} />
      )
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleSalidaMercancia(record.id, record.cantidad_salida)}>Salida </Button>
      )
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={productos} rowKey="id" />
      </div>
  );
};

export default SalidaProductos;
