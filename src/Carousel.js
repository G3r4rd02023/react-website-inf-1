import React,  { useState, useEffect } from "react";
import Slider from "react-slick";
//import Slider from 'react-slider';
import './Carousel.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);  
  const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 3000);
  
      return () => clearInterval(interval);
    }, []);

    const totalSlides = 3; // Total de diapositivas en el carrusel

  const handleSlideChange = (index) => {
    setCurrentIndex(index);
  };

    return (
      
      <div className="carousel-container"> {/* Agrega la clase CSS al contenedor */}
      <Slider {...settings}  value={currentIndex}
      onChange={handleSlideChange}
      min={0}
      max={totalSlides - 1}
      >
       <div>
        <img src="/images/slide1.jpg" alt="Imagen 1" />
      </div>
        <div>
        <img src="/images/slide2.jpg" alt="Imagen 2" />
        </div>
        <div>
        <img src="/images/slide3.jpg" alt="Imagen 3" />
        </div>
      </Slider>
      </div>
    ) ;
  };
  
  export default Carousel;
  