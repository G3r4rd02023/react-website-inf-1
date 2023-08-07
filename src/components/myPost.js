import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Importa la librería de Auth0
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import TextField from '@mui/material/TextField';


export default function PostList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); 
  const { user } = useAuth0(); // Obtiene la información del usuario autenticado desde Auth0
   // Agregar el estado para almacenar el texto de búsqueda
  const [filterText, setFilterText] = useState("");

  // Función para actualizar el texto de búsqueda
  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  

  async function publicarPost(id) {
    // Obtén el post correspondiente al ID
    const post = posts.find((post) => post._id === id);
    if (!post) {
      console.error("No se encontró el post para publicar.");
      return;
    }

    // Realizar la solicitud PUT al servidor para actualizar el estado a "publicado"
    await fetch(`http://localhost:5050/post/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado: "publicado",
        titulo: post.titulo,
        imagen: post.imagen,
        contenido: post.contenido,
        etiquetas: post.etiquetas,
        autor: post.autor,
      }),
    });

    // Actualizar el estado local del post para reflejar el cambio
    const updatedPost = { ...post, estado: "publicado" };
    updatePost(updatedPost);
  }
  // Función para obtener el texto sin formato de HTML
  const getPlainText = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const editarPost = (id) => {
    navigate(`/edit/${id}`);
  };

  // Esta función manejará la acción de eliminar un post
const eliminarPost = async (id) => {
  // Mostrar el cuadro de diálogo de confirmación
  const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este registro?");

  // Si el usuario ha confirmado, proceder con la eliminación
  if (confirmed) {
    // Realizar la solicitud DELETE al servidor
    await fetch(`http://localhost:5050/post/${id}`, {
      method: "DELETE",
    });

    // Actualizar el estado local de los posts filtrando el elemento con el ID coincidente
    const newPosts = posts.filter((el) => el._id !== id);
    setPosts(newPosts);
  }
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
          onClick={() => editarPost(row._id)}
          style={{ color: "black", marginRight: "5px" }}
        >
        <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={() => eliminarPost(row._id)}
          style={{ color: "black", marginRight: "5px" }}
        >
        <FontAwesomeIcon icon={faTrashAlt} />
        </button>
        <button
          className="btn btn-outline-success"
          onClick={() => publicarPost(row._id)}
          style={{ color: "black" }}
        >
        <FontAwesomeIcon icon={faCheckCircle} />
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

  
  async function updatePost(updatedPost) {
    // Actualizar el estado local de los posts
    const updatedPosts = posts.map((post) =>
      post._id === updatedPost._id ? updatedPost : post
    );
    setPosts(updatedPosts);
  }

  const crearNuevoPost = () => {
    // Agregar aquí la lógica para abrir un formulario de creación de blog o cualquier otra acción deseada
    console.log("Crear nuevo blog");
    navigate("/create");
  };

  // Aplicar el filtro de búsqueda a los datos
  const filteredPosts = posts.filter((post) => {
    return post.autor === user?.name && post.titulo.toLowerCase().includes(filterText.toLowerCase());
  });
 
  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3 style={{ color: 'white' }}>Mis Publicaciones</h3>
      <button className="btn btn-outline-primary" style={{ color: "white", marginBottom: "10px" }} onClick={crearNuevoPost}>
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
        data={filteredPosts}
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
