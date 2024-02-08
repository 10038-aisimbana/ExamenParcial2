# Pasos Para la Ejecución
Intalar todas las dependecias y librerias
### `npm install`
### `npm install antd`
### `npm install file-saver html2pdf.js`
### `npm install @supabase/supabase-js`
### `npm install moment`

Ejecutamos el proyecto de React
### `npm start`
[http://localhost:3000](http://localhost:3000)

Creacion de la Base de datos en Supabase
### `CREATE TABLE marcas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    pais VARCHAR(100)
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    marca_id INTEGER REFERENCES marcas(id),
    descripcion TEXT,
    color VARCHAR(100),
    cantidad INTEGER,
    categoria_id INTEGER REFERENCES categorias(id)
);
`


