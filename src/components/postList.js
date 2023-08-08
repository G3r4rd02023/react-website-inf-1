import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye} from "@fortawesome/free-solid-svg-icons";
import TextField from '@mui/material/TextField';


export default function PostList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); 
 
  const [filterText, setFilterText] = useState("");

  // Función para actualizar el texto de búsqueda
  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  

  
  // Función para obtener el texto sin formato de HTML
  const getPlainText = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const verPost = (id) => {
    navigate(`/details/${id}`);
  };

  

  const columns = [
    {
      name: "Titulo",
      selector: "titulo",
      sortable: true,
    },
    {
      name: "Imagen",
      cell: (row) => <img src={`http://localhost:5050/uploads/${row.imagen}`} alt={row.titulo} style={{ maxWidth: "100px" }} />,
    },
    {
      name: "Contenido",
      selector: "contenido",
      cell: (row) => getPlainText(row.contenido),
    },
    {
      name: "Etiquetas",
      selector: "etiquetas",
      sortable: true,
    },
    {
      name: "Estado",
      selector: "estado",
      sortable: true,
    },
    {
      name: "Autor",
      selector: "autor",
      sortable: true,
    },
    {
      name: "Acciones",
    cell: (row) => (
      <>
        <button
          className="btn btn-outline-warning"
          onClick={() => verPost(row._id)}
          style={{ color: "black", marginRight: "5px" }}
        >
        <FontAwesomeIcon icon={faEye} />
        </button>
        
      </>
    ),
    }
    
  ];
  
  // This method fetches the records from the database.
  useEffect(() => {
    async function getPosts() {
      const response = await fetch(`http://localhost:5050/post/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const posts = await response.json();
      setPosts(posts);
    }

    getPosts();

    return;
  }, [posts.length]);

  
 

  const crearNuevoPost = () => {
    // Agregar aquí la lógica para abrir un formulario de creación de blog o cualquier otra acción deseada
    console.log("Crear nuevo blog");
    navigate("/create");
  };

  // Aplicar el filtro de búsqueda a los datos
  const publicadoPosts = posts.filter((post) => post.estado === "publicado");

 
  // This following section will display the table with the records of individuals.
  return (
    <div  style={{ marginTop: '80px' }}>
      <h3 style={{ color: 'purple' }}>Blog Lovely</h3>
      <button className="btn btn-primary" style={{ color: "white", marginBottom: "10px" }} onClick={crearNuevoPost}>
        Crear Post
      </button>
      <TextField
        id="filter-input"
        label="Buscar"
        variant="outlined"
        size="small"
        value={filterText}
        onChange={handleFilter}
        style={{ marginBottom: "10px" , color: "white"}}
      />
      <DataTable
        columns={columns}
        data={publicadoPosts}
        pagination // Activa la paginación
        striped // Alterna el fondo de las filas para mejorar la legibilidad
        highlightOnHover // Resalta la fila cuando el usuario coloca el cursor sobre ella
        pointerOnHover // Cambia el cursor cuando el usuario coloca el cursor sobre una fila
        defaultSortField="titulo" // Campo predeterminado para ordenar
        defaultSortAsc={true} // Orden ascendente por defecto
        paginationPerPage={10} // Cantidad de elementos por página
        noHeader // Oculta el encabezado de la tabla
        noDataComponent="No hay datos disponibles" // Mensaje cuando no hay datos
        responsive // Hace que la tabla sea responsive
        searchable
      />
      
    </div>
  );
}
