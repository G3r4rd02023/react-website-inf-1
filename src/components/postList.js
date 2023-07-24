import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
 
const Post = (props) => (
 <tr>
   <td>{props.post.titulo}</td>
   <td>{props.post.imagen && (
       <img
       src={`http://localhost:5050/uploads/${props.post.imagen}`}
       alt={props.post.titulo}
       style={{ maxWidth: "100px" }} // Ajusta el estilo según tus necesidades
     />)}</td>
   <td>{props.post.contenido}</td>
   <td>{props.post.etiquetas}</td>
   <td>
     <Link className="btn btn-link" to={`/edit/${props.post._id}`}>Editar</Link> |
     <button className="btn btn-link"
       onClick={() => {
         props.deleteRecord(props.post._id);
       }}
     >
       Eliminar
     </button>
   </td>
 </tr>
);
 
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
   await fetch(`http://localhost:5050/post/${id}`, {
     method: "DELETE"
   });
 
   const newPosts = posts.filter((el) => el._id !== id);
   setPosts(newPosts);
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
     <h3>Blog</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Titulo</th>
           <th>Imagen</th>
           <th>Contenido</th>
           <th>Etiquetas</th>
         </tr>
       </thead>
       <tbody>{postList()}</tbody>
     </table>
   </div>
 );
}