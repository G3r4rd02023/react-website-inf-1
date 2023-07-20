import { MongoClient } from "mongodb";

const connectionString = process.env.MONGO_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect(); 
  console.log("Connected to MongoDB Atlas");
} catch(e) {
  console.error(e);
}
console.log("Antes de la conexión a la base de datos");
let db = conn.db("merndb");
console.log("Después de la conexión a la base de datos");
export default db;