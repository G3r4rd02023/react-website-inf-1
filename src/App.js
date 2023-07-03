import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "./Carousel";

function App() {
    
return (
<>
<Router>
<Navbar />
<Carousel />
<Routes>
<Route path='/' />
</Routes>
</Router>
</>
);
}
export default App;


