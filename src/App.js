import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';


function App() {
  return (
    <>
      <Router>
        <Navbar />                                
        <Routes>             
          <Route path="/" />
        </Routes>       
      </Router>
    </>
  );
}

export default App;
