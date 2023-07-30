import express from "express";
import multer from "multer";
import cors from "cors";
import "./loadEnvironment.mjs";
import posts from "./routes/post.mjs";
import { MongoClient } from "mongodb";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from "path"; 

const MONGO_URI = process.env.MONGO_URI; // Cambia esta URI por la de tu base de datos MongoDB
const MONGO_DB_NAME = "merndb";
const app = express();
const PORT = process.env.PORT || 5050;

// Obtenemos la ruta actual del archivo y construimos la ruta completa hacia la carpeta "uploads"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOADS_FOLDER = join(__dirname, "uploads");

// Configurar Multer para guardar las imágenes en la carpeta "uploads"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
// Middleware para el manejo de imágenes y datos JSON
app.use(cors());
app.use(express.json());
app.use("/post", posts);

// Define una función async para manejar la inserción en la base de datos
async function insertDocumentIntoDB(newDocument) {
  try {
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db(MONGO_DB_NAME);
    const collection = db.collection("posts");

    const result = await collection.insertOne(newDocument);

    console.log("Resultado de la inserción:", result); // Agrega esta línea para verificar el resultado de la inserción

    client.close();
  } catch (error) {
    console.error("Error al insertar el documento:", error);
    throw error;
  }
}


// Ruta para subir la imagen y guardar los datos en la base de datos
app.post("/upload", upload.single("imagen"), async (req, res) => {
  // En este punto, multer habrá procesado los datos de la imagen y los colocará en req.file
  console.log(req.file); // Verifica el objeto req.file para asegurarte de que contiene la imagen subida

  try {
    const newDocument = {
      titulo: req.body.titulo,     
      contenido: req.body.contenido,
      etiquetas: req.body.etiquetas,
      estado: req.body.estado,
      autor: req.body.autor
    };

    if (req.file) {
      // Si se envía una nueva imagen, actualizar el campo de imagen solo si se ha subido una nueva imagen
      newDocument.imagen = req.file.filename;
    } else {
      // Si no se envía una imagen, establecer el campo de imagen como nulo
      newDocument.imagen = null;
    }

    await insertDocumentIntoDB(newDocument); // Llama a la función async para insertar datos en la base de datos

    res.json({ message: "OK" }); 
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send("Error al procesar la solicitud.");
  }
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
