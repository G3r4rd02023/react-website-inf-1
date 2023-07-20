import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import posts from "./routes/post.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/post", posts);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});