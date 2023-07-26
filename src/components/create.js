import React, { useState } from "react";
import { useNavigate } from "react-router";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 


export default function Create() {
  
  const [form, setForm] = useState({
    titulo: "",
    imagen: "",
    contenido: "",
    etiquetas: "",
  });
  
 

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (e) => {
    console.log(selectedImage)
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
    console.log(selectedImage); 
  };
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

  // These methods will update the state properties.
  function updateForm(value) {
    //console.log(form)
    setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    console.log("Formulario enviado")
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    const formData = new FormData();
    formData.append("titulo", form.titulo);
    formData.append("contenido", form.contenido);
    formData.append("etiquetas", form.etiquetas);
   
    if (selectedImage) {
      formData.append("imagen", selectedImage);
    }

    const url = "http://localhost:5050/upload"; 

    await fetch(url, {
      method: "POST",
      body: formData,
    })
    
    .then((response) => response.json())
    .then((data) => {
      console.log("Server response:", data); // Verifica la respuesta del servidor
      setForm({ titulo: "", imagen: "", contenido: "", etiquetas: "" });
      setSelectedImage(null);
      navigate("/");
      
    })
    .catch((error) => {
      window.alert("El registro fue agregado exitosamente");
      //console.error("Error:", error);
    });
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h3 style={{ color: 'white' }}>Crear nuevo Post</h3>
      <form onSubmit={onSubmit} encType="multipart/form-data"> {/* Añadir el atributo encType aquí */}
        <div className="form-group">
          <label htmlFor="titulo" style={{ color: 'white' }}>Titulo</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            value={form.titulo}
            onChange={(e) => updateForm({ titulo: e.target.value })}
            
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagen" style={{ color: 'white' }}>Imagen</label>
          <input
            type="file"
            className="form-control"
            id="imagen"
            onChange={handleImageChange}
           
          />
        </div>
        <div className="form-group">
          <label htmlFor="contenido" style={{ color: 'white' }}>Contenido</label>
          <ReactQuill
            value={form.contenido} // Usar form.contenido en lugar de contenido
            onChange={(value) => updateForm({ contenido: value })} // Usar updateForm para actualizar contenido
            modules={quillModules}
            formats={quillFormats}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags" style={{ color: 'white' }}>Etiquetas</label>
          <input
            type="text"
            className="form-control"
            id="tags"
            value={form.etiquetas} // Usar form.etiquetas en lugar de form.tags
            onChange={(e) => updateForm({ etiquetas: e.target.value })} 
           // Usar updateForm para actualizar etiquetas
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Crear Post"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
