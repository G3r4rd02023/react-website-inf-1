import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
 
export default function Detail() {
    const [postDetails, setPostDetails] = useState({
        titulo: "",
        imagen: "",
        contenido: "",
        etiquetas: "",
        estado: "",
        autor: "",
      });
 const params = useParams();
 const navigate = useNavigate();
 
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
    </div>
 );
}