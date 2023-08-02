import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";

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
      </td>
    </tr>
  );
};

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); 

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

  // This method will map out the records on the table
  function postList() {
    // Filtra los posts que tengan el estado "publicado"
    const publicadoPosts = posts.filter((post) => post.estado === "publicado");

    return publicadoPosts.map((post) => {
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
      <h3 style={{ color: 'white' }}>Blog</h3>
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
