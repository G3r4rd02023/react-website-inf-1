import React, { useState } from "react";
import { useNavigate } from "react-router";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { useAuth0 } from '@auth0/auth0-react';


export default function Create() {
  
  const [form, setForm] = useState({
    titulo: "",
    imagen: "",
    contenido: "",
    etiquetas: "",
    estado:"borrador",
    autor:"",
  });
  
  
  const { isAuthenticated, user } = useAuth0(); 
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

  // Método para validar los campos del formulario
  function validateForm() {
    const errors = {};


    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    if (!form.imagen.trim) {
      errors.imagen = "Debes seleccionar una imagen";
    }
  
    if (!form.titulo.trim()) {
      errors.titulo = "El título es obligatorio";
    }else if (form.titulo.length < 5 || form.titulo.length > 100) {
      errors.titulo = "El titulo debe tener entre 5 y 100 caracteres";
    }


    if (!form.contenido.trim()) {
      errors.contenido = "El contenido es obligatorio";
    }

    if (!form.etiquetas.trim()) {
      errors.etiquetas = "Las etiquetas son obligatorias";
    }

      // Agrega aquí otras validaciones para los campos que necesites

      return errors;
    }

  // Establecer el nombre del usuario en el campo "autor"
  useState(() => {
    if (isAuthenticated && user) {
      setForm((prevForm) => ({
        ...prevForm,
        autor: user.name, // Usamos el nombre del usuario autenticado
      }));
    }
  }, [isAuthenticated, user]);

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
  // Validar el formulario antes de enviarlo
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setError(errors);
    return;
  }
    
    // When a post request is sent to the create url, we'll add a new record to the database.
    const formData = new FormData();
    formData.append("titulo", form.titulo);
    formData.append("contenido", form.contenido);
    formData.append("etiquetas", form.etiquetas);
    formData.append("estado",form.estado);
    formData.append("autor",form.autor);
   
    if (selectedImage) {
      formData.append("imagen", selectedImage);
    } else {
      formData.append("imagen", ""); // Agrega una cadena vacía para indicar que el campo de imagen es nulo
    }

    const url = "http://localhost:5050/upload"; 

    await fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          // Si la respuesta del servidor es exitosa, se devuelve la respuesta
          return response.json();
        } else {
          // Si la respuesta del servidor no es exitosa, se lanza un error con el mensaje del servidor
          const text = await response.text();
          throw new Error(text);
        }
      })
      .then((data) => {
        // Aquí manejas la respuesta si es un JSON válido
        console.log("Server response:", data);
        setForm({ titulo: "", imagen: "", contenido: "", etiquetas: "", estado: "", autor: "" });
        setSelectedImage(null);
        console.log("Creado exitosamente");
        window.alert("Registro Creado exitosamente");
        navigate("/myPost");
      })
      .catch((error) => {
        // Aquí manejas el error si la respuesta no es exitosa o no es un JSON válido
        window.alert("Hubo un error al agregar el registro");
        console.error("Error:", error);
      });
    
  }

  

  const [error, setError] = useState({}); // Estado para controlar los mensajes de error
  // This following section will display the form that takes the input from the user.
  return (
    <div style={{ marginTop: '80px' }}>
      <h3 style={{ color: 'purple' }}>Crear nuevo Post</h3>
      <form onSubmit={onSubmit} encType="multipart/form-data"> {/* Añadir el atributo encType aquí */}
        <div className="form-group">
          <label htmlFor="titulo" style={{ color: 'purple' }}>Titulo</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            value={form.titulo}
            onChange={(e) => {
              updateForm({ titulo: e.target.value });
              setError((prevError) => ({ ...prevError, titulo: "" }));
            }}
            
          />
            {error.titulo && <div style={{ color: "red" }}>{error.titulo}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="imagen" style={{ color: 'purple' }}>Imagen</label>
          <input
            type="file"
            className="form-control"
            id="imagen"
            onChange={handleImageChange}
           
          />
        </div>
        <div className="form-group">
          <label htmlFor="contenido" style={{ color: 'purple' }}>Contenido</label>
          <ReactQuill
            value={form.contenido} // Usar form.contenido en lugar de contenido
            onChange={(value) => {
              updateForm({ contenido: value });
              setError((prevError) => ({ ...prevError, contenido: "" }));
            }} // Usar updateForm para actualizar contenido
            modules={quillModules}
            formats={quillFormats}
          />
           {error.contenido && (
            <div style={{ color: "red" }}>{error.contenido}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="tags" style={{ color: 'purple' }}>Etiquetas</label>
          <input
            type="text"
            className="form-control"
            id="tags"
            value={form.etiquetas} // Usar form.etiquetas en lugar de form.tags
            onChange={(e) => {
              updateForm({ etiquetas: e.target.value });
              setError((prevError) => ({ ...prevError, etiquetas: "" }));
            }}
           // Usar updateForm para actualizar etiquetas
          />
           {error.etiquetas && (
            <div style={{ color: "red" }}>{error.etiquetas}</div>
          )}
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
