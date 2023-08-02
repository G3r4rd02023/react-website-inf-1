import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Importa la librería de Auth0
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Post = (props) => {
  const [plainTextContent, setPlainTextContent] = useState("");
 
  
 
  // Función para obtener el texto sin formato de HTML
  const getPlainText = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  useEffect(() => {
    // Obtener el texto sin formato cuando cambie el contenido HTML
    const plainText = getPlainText(props.post.contenido);
    setPlainTextContent(plainText);
  }, [props.post.contenido]);

  // Función para cambiar el estado del blog a "publicado"
  async function publicarPost() {
    const { titulo, imagen, contenido, etiquetas, autor } = props.post;
    // Realizar la solicitud PUT al servidor para actualizar el estado a "publicado"
    await fetch(`http://localhost:5050/post/${props.post._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado: "publicado",
        titulo,
        imagen,
        contenido,
        etiquetas,
        autor,
      }),
    });

    // Actualizar el estado local del post para reflejar el cambio
    const updatedPost = { ...props.post, estado: "publicado" };
    props.updatePost(updatedPost);
  }

  return (
    <tr>
      <td>{props.post.titulo}</td>
      <td>
        {props.post.imagen && (
          <img
            src={`http://localhost:5050/uploads/${props.post.imagen}`}
            alt={props.post.titulo}
            style={{ maxWidth: "100px" }} // Ajusta el estilo según tus necesidades
          />
        )}
      </td>
      <td>{plainTextContent}</td>
      <td>{props.post.etiquetas}</td>
      <td>{props.post.estado}</td>
      <td>{props.post.autor}</td>
      <td>
        <Link className="btn btn-outline-warning" to={`/edit/${props.post._id}`}  style={{ color: "black" }}>
          Editar
        </Link>{" "}
        
        <button
          className="btn btn-outline-danger"  style={{ color: "black" }}
          onClick={() => {
            props.deleteRecord(props.post._id);
          }}
        >
          Eliminar
        </button> 
        <button className="btn btn-outline-success" onClick={publicarPost} style={{ color: "black" }}>
          Publicar
        </button>      
      </td>
    </tr>
  );
};

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); 
  const { user } = useAuth0(); // Obtiene la información del usuario autenticado desde Auth0

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

  // This method will delete a record
  async function deleteRecord(id) {
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
  }
  
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

  // Filtrar los registros por el autor actualmente autenticado (user.sub)
  const filteredPosts = posts.filter((post) => post.autor === user?.name);
  console.log(user?.name)

  // This method will map out the records on the table
  function postList() {
    return filteredPosts.map((post) => {    
      return (
        <Post
          post={post}
          deleteRecord={() => deleteRecord(post._id)}
          updatePost={updatePost} 
          key={post._id}
        />
      );   
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3 style={{ color: 'white' }}>Mis Publicaciones</h3>
      <button className="btn btn-outline-primary" style={{ color: "white", marginBottom: "10px" }} onClick={crearNuevoPost}>
        Crear Post
      </button>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th style={{ color: "black" }}>Titulo</th>
            <th style={{ color: "black" }}>Imagen</th>
            <th style={{ color: "black" }}>Contenido</th>
            <th style={{ color: "black" }}>Etiquetas</th>
            <th style={{ color: "black" }}>Estado</th>
            <th style={{ color: "black" }}>Autor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{postList()}</tbody>
      </table>
    </div>
  );
}
