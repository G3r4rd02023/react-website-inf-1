import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Footer from './Footer';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Carousel autoPlay={true} interval={3000} stopOnHover={true} infiniteLoop={true}>
          <div>
            <img src="/images/slide1.jpg" alt="Imagen 1" />
          </div>
          <div>
            <img src="/images/slide2.jpg" alt="Imagen 2" />
          </div>
          <div>
            <img src="/images/slide3.jpg" alt="Imagen 3" />
          </div>
        </Carousel>
        <Footer />
        <Routes>
          <Route path="/" />
        </Routes>
      </Router>
    </>
  );
}

export default App;
