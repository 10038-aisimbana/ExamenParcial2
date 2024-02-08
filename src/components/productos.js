import { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Form, Input, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { supabase } from '../supabase';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [originalProductos, setOriginalProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);
    const [modalMode, setModalMode] = useState('detalle');
    const [form] = Form.useForm();

    const fetchProductos = async () => {
      setLoading(true);
      try {
        const { data: productosData, error: productosError } = await supabase.from('productos').select('*');
        const { data: marcasData, error: marcasError } = await supabase.from('marcas').select('*');
        const { data: categoriasData, error: categoriasError } = await supabase.from('categorias').select('*');
  
        if (productosError || marcasError || categoriasError) {
          throw productosError || marcasError || categoriasError;
        }
  
        const productosConInfoAdicional = productosData.map(producto => {
          const marca = marcasData.find(marca => marca.id === producto.marca_id);
          const categoria = categoriasData.find(categoria => categoria.id === producto.categoria_id);
          return {
            ...producto,
            marca_nombre: marca ? marca.nombre : 'Desconocida',
            categoria_nombre: categoria ? categoria.nombre : 'Desconocida'
          };
        });
  
        setProductos(productosConInfoAdicional);
        setOriginalProductos(productosConInfoAdicional);
      } catch (error) {
        console.error('Error fetching productos:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setEditedProduct(product);
        setModalMode('editar');
        setVisible(true);
      };
  
    const handleDelete = async (productId) => {
      try {
        const { error } = await supabase.from('productos').delete().eq('id', productId);
        if (error) {
          throw error;
        }
        fetchProductos();
      } catch (error) {
        console.error('Error deleting producto:', error.message);
      }
    };
  
    const handleDetails = (product) => {
        setSelectedProduct(product);
        setEditedProduct(product);
        setModalMode('detalle');
        setVisible(true);
      };

      const handleOk = async () => {
        try {
          const values = await form.validateFields();
          const { error } = await supabase.from('productos').update(values).eq('id', selectedProduct.id);
          if (error) {
            throw error;
          }
          fetchProductos();
          setVisible(false);
        } catch (error) {
          console.error('Error updating producto:', error.message);
        }
      };

    useEffect(() => {
      fetchProductos();
    }, []); 

    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Tipo', dataIndex: 'nombre', key: 'nombre' },
      { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
      { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
      { title: 'Precio', dataIndex: 'precio', key: 'precio' },
      { title: 'Marca', dataIndex: 'marca_nombre', key: 'marca_nombre' },
      { title: 'Categoría', dataIndex: 'categoria_nombre', key: 'categoria_nombre' },
      { 
        title: 'Acciones', 
        key: 'acciones', 
        render: (text, record) => (
          <Space size="middle">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Editar</Button>
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Eliminar</Button>
            <Button icon={<InfoCircleOutlined />} onClick={() => handleDetails(record)}>Detalles</Button>
          </Space>
        ), 
      },
    ];

    const handleSearch = (value) => {
      const filteredProducts = originalProductos.filter(producto =>
        Object.values(producto).some(val => typeof val === 'string' && val.toLowerCase().includes(value.toLowerCase()))
      );
      setProductos(filteredProducts);
    };

    const handleDownloadPDF = () => {
      const table = document.getElementById('productos-table');
      html2pdf().from(table).save();
    };

    return (
      <div>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={() => fetchProductos()} icon={<SearchOutlined />}>Limpiar búsqueda</Button>
          <Input.Search placeholder="Buscar producto" onSearch={handleSearch} enterButton />
          <Button icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Descargar PDF</Button>
        </Space>
        <Table id="productos-table" columns={columns} dataSource={productos} loading={loading} />
        <Modal
  title={modalMode === 'editar' ? 'Editar Producto' : 'Detalles del Producto'}
  visible={visible}
  onCancel={() => setVisible(false)}
  onOk={handleOk}
>
  {modalMode === 'editar' ? (
    <Form
      form={form}
      layout="vertical"
      initialValues={selectedProduct}
      onValuesChange={(changedValues, allValues) => setEditedProduct(allValues)}
    >
      <Form.Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Descripción"
        name="descripcion"
        rules={[{ required: true, message: 'Por favor ingrese la descripción del producto' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        label="Precio"
        name="precio"
        rules={[{ required: true, message: 'Por favor ingrese el precio del producto' }]}
      >
        <InputNumber min={0} step={0.01} />
      </Form.Item>
    </Form>
  ) : (
    selectedProduct && (
      <div>
        <p><strong>Tipo:</strong> {selectedProduct.nombre}</p>
        <p><strong>Descripción:</strong> {selectedProduct.descripcion}</p>
        <p><strong>Precio:</strong> {selectedProduct.precio}</p>
        <p><strong>Marca:</strong> {selectedProduct.marca_nombre}</p>
        <p><strong>Categoría:</strong> {selectedProduct.categoria_nombre}</p>
        <p><strong>Color:</strong> {selectedProduct.color}</p>
        <p><strong>Cantidad:</strong> {selectedProduct.cantidad}</p>
        {/* <p><strong>Foto:</strong> <img src={`${selectedProduct.foto}`} width={150} height={150}/></p> */}
      </div>
    )
  )}
</Modal>

      </div>
    );
  };
  
  export default Productos;
