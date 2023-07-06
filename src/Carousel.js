import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Carousel() {
  return (
    <Carousel autoPlay={true} interval={3000}> {/* intervalo de tiempo en milisegundos */}
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
  );
}


  

 
  