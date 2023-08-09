import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth0 } from "@auth0/auth0-react"; 

 
export default function Detail() {
    const [postDetails, setPostDetails] = useState({
        titulo: "",
        imagen: "",
        contenido: "",
        etiquetas: "",
        estado: "",
        autor: "",
        comentarios: [],
      });
 const [newComment, setNewComment] = useState("");     
 const params = useParams();
 const navigate = useNavigate();
 const { user } = useAuth0(); 
 
 // Configuración para el editor de texto
 const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:5050/post/${params.id.toString()}`);
 
     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const post = await response.json();
     if (!post) {
       window.alert(`Post con id ${id} no encontrado`);
       navigate("/");
       return;
     }
 
     setPostDetails(post);
   }
 
   fetchData();
 
   return;
 }, [params.id, navigate]);
 
 // Función para manejar la adición de comentarios
 const handleAddComment = async () => {
  if (newComment.trim() === "") {
    return;
  }

  // Obtener la fecha y hora actual del sistema
  //const currentDate = new Date().toISOString(-6);
  const currentDate = new Date().getTimezoneOffset();
   
  
  
  

  // Obtener el nombre de usuario autenticado (sustituye 'usuarioAutenticado' por la forma en que obtienes este valor)
  const usuarioAutenticado = user.name;

  const response = await fetch(
    `http://localhost:5050/post/${params.id.toString()}/comentarios`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        autor: usuarioAutenticado, // Define el autor del comentario (puede ser el nombre del usuario actual)
        contenido: newComment,
        fecha: currentDate,
      }),
    }
  );

  if (response.ok) {
    // Actualizar la lista de comentarios con el nuevo comentario
    setPostDetails((prevDetails) => ({
      ...prevDetails,
      comentarios: [
        ...prevDetails.comentarios,
        {
          autor: usuarioAutenticado,
          contenido: newComment,
          fecha: currentDate,
        },
      ],
    }));

    setNewComment(""); // Limpiar el campo de nuevo comentario
  }
};



 
 return (
   <div  style={{ marginTop: '80px' }}>
     <h3 style={{ color: 'white' }}>Detalles</h3>
     
       <div className="detail-item">
       <h4>Titulo: {postDetails.titulo}</h4>
       <img
        src={`http://localhost:5050/uploads/${postDetails.imagen}`}
        alt="Lovely View"
        style={{ maxWidth: '100%', height: '200px' }}
        />
       <div className="quill-container">
          <ReactQuill
            value={postDetails.contenido}
            modules={quillModules}
            formats={quillFormats}
            readOnly
          />
        </div>       
        <p>Etiquetas: {postDetails.etiquetas}</p>
        <p>Estado: {postDetails.estado}</p>
        <p>Autor: {postDetails.autor}</p>
      </div>
      <hr></hr>
      
      <div className="comment-list">
        <h4>Comentarios</h4>
        <ul>
        {postDetails.comentarios.map((comment) => (
        <li key={comment._id}>
          <p>Autor: {comment.autor}</p>
          <p>{comment.contenido}</p>
          <p>Fecha: {comment.fecha}</p>          
          <hr />
        </li>
        ))}                 
        </ul>
      </div>
      <div className="comment-section">
        <h4>Agregar Comentario</h4>
        <textarea
          rows="4"
          cols="50"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment} style={{ backgroundColor: 'purple', color: 'white' }}>Agregar Comentario</button>
      </div>
      <hr></hr>
    </div>
 );
}