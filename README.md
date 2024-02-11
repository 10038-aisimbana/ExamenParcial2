# Examen Parcial 2
Nombre: Adrian Isaee Simbaña Moreira
NRC: 14386

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

# Base de datos Supabase
Ejecutar el script en Supabase

```
CREATE TABLE marcas (
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
```
# IMPORTANTE!!
Colocar las credenciales respectivas de supabase en el archivo 
### `supabase.js`

```
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "Url Supabase", 
    "Key Supabase"
);
```

# OJOO 
Antes de ingresar cualquier producto se debe ingresar una categoría y una marca.
