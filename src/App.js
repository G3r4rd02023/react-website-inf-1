import React from 'react';

import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import PostList from "./components/postList";
import Edit from "./components/edit";
import Create from "./components/create";
import MyPost from "./components/myPost";
import Footer from './components/Footer';


import './index.css';


function App() {
  return (
    <>      
      <Router>
      <Navbar />              
      <Routes>
      <Route path="/" element={
            <>
              <Carousel autoPlay={true} interval={3000} stopOnHover={true} infiniteLoop={true}>
                <div>
                  <img src="/images/image1.jpg" alt="Imagen 1" />
                </div>
                <div>
                  <img src="/images/image2.jpg" alt="Imagen 2" />
                </div>
                <div>
                  <img src="/images/image3.jpg" alt="Imagen 3" />
                </div>
                <div>
                  <img src="/images/image4.jpg" alt="Imagen 4" />
                </div>
                <div>
                  <img src="/images/image5.jpg" alt="Imagen 5" />
                </div>
              </Carousel>
              </>
          } />
          <Route path="/postList" element={<PostList />} />
          <Route path="/edit/:id" element={<Edit />} />            
          <Route path="/create" element={<Create />} /> 
          <Route path="/myPost" element={<MyPost />} /> 
      </Routes>  
      <Footer />                                                  
    </Router>
    </>
  );
}

export default App;
