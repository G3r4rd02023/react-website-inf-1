import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      <td>
        <Link className="btn btn-link" to={`/edit/${props.post._id}`}  style={{ color: "white" }}>
          Editar
        </Link>{" "}
        
        <button
          className="btn btn-link"  style={{ color: "white" }}
          onClick={() => {
            props.deleteRecord(props.post._id);
          }}
        >
          Eliminar
        </button>       
      </td>
    </tr>
  );
};

export default function PostList() {
  const [posts, setPosts] = useState([]);

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
  

  // This method will map out the records on the table
  function postList() {
    return posts.map((post) => {
      return (
        <Post
          post={post}
          deleteRecord={() => deleteRecord(post._id)}
          key={post._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3 style={{ color: 'white' }}>Blog</h3>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th style={{ color: "white" }}>Titulo</th>
            <th style={{ color: "white" }}>Imagen</th>
            <th style={{ color: "white" }}>Contenido</th>
            <th style={{ color: "white" }}>Etiquetas</th>
          </tr>
        </thead>
        <tbody>{postList()}</tbody>
      </table>
    </div>
  );
}
