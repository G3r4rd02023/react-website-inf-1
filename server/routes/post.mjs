import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";


const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("posts");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("posts");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  console.log("Request body:", req.body);
  const newDocument = {
    titulo: req.body.titulo,
    imagen: req.body.imagen, // Asegúrate de obtener el buffer de la imagen desde el cliente y pasarlo aquí.
    contenido: req.body.contenido,
    etiquetas: req.body.etiquetas,
  };
  const collection = await db.collection("posts");
  const result = await collection.insertOne(newDocument);

  // Enviar el código de estado 201 ("Created") junto con el objeto creado en la respuesta.
  if (Array.isArray(result.ops) && result.ops.length > 0) {
    res.status(201).send(result.ops[0]);
  } else {
    res.status(500).send("Error: No se pudo insertar el documento en la base de datos.");
  }
  
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      titulo: req.body.titulo,
      imagen: req.body.imagen, // Asegúrate de obtener el buffer de la imagen desde el cliente y pasarlo aquí.
      contenido: req.body.contenido,
      etiquetas: req.body.etiquetas,
    },
  };

  const collection = await db.collection("posts");
  const result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});


// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("posts");
  const result = await collection.deleteOne(query);

  // Enviar el código de estado 204 ("No Content") para una operación de eliminación exitosa.
  res.sendStatus(204);
});

export default router;