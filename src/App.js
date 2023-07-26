import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from "./components/postList";
import Edit from "./components/edit";
import Create from "./components/create";


import './index.css';


function App() {
  return (
    <>      
      <Router>
      <div className="container">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/"  />
            <Route path="/postList" element={<PostList />} />
            <Route path="/edit/:id" element={<Edit />} />            
            <Route path="/create" element={<Create />} /> 
          </Routes>
        </div>
      </div>
    </Router>
    </>
  );
}

export default App;
