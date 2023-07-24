import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
 
export default function Edit() {
 const [form, setForm] = useState({
   titulo: "",
   imagen: "",
   contenido: "",
   etiquetas: "",
   posts: [],
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
 
     setForm(post);
   }
 
   fetchData();
 
   return;
 }, [params.id, navigate]);
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 async function onSubmit(e) {
   e.preventDefault();
   const editedPerson = {
     titulo: form.titulo,
     imagen: form.imagen,
     contenido: form.contenido,
     etiquetas: form.etiquetas,
   };
 
   // This will send a post request to update the data in the database.
   await fetch(`http://localhost:5050/post/${params.id}`, {
     method: "PATCH",
     body: JSON.stringify(editedPerson),
     headers: {
       'Content-Type': 'application/json'
     },
   });
 
   navigate("/");
 }
 
 // This following section will display the form that takes input from the user to update the data.
 return (
   <div>
     <h3>Actualizar Post</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="titulo">Titulo: </label>
         <input
           type="text"
           className="form-control"
           id="titulo"
           value={form.titulo}
           onChange={(e) => updateForm({ titulo: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="image">Imagen: </label>
         <input
           type="text"
           className="form-control"
           id="imagen"
           value={form.imagen}
           onChange={(e) => updateForm({ imagen: e.target.value })}
         />      
       </div>
       <div className="form-group">
          <label htmlFor="contenido">Contenido</label>
          <ReactQuill
            value={form.contenido} // Usar form.contenido en lugar de contenido
            onChange={(value) => updateForm({ contenido: value })} // Usar updateForm para actualizar contenido
            modules={quillModules}
            formats={quillFormats}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Etiquetas</label>
          <input
            type="text"
            className="form-control"
            id="tags"
            value={form.etiquetas} // Usar form.etiquetas en lugar de form.tags
            onChange={(e) => updateForm({ etiquetas: e.target.value })} // Usar updateForm para actualizar etiquetas
          />
        </div>
       <br />
 
       <div className="form-group">
         <input
           type="submit"
           value="Actualizar Post"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}