import React from 'react';
import ImageGallery from './ImageGallery';

import img1 from '../assets/posle1.jpg';
import img2 from '../assets/posle2.jpg';
import img3 from '../assets/posle3.jpg';
import img4 from '../assets/posle4.jpg';
import img5 from '../assets/posle5.jpg';
import img6 from '../assets/posle6.jpg';
import img7 from '../assets/posle7.jpg';
import img8 from '../assets/posle8.jpg';
import img9 from '../assets/posle9.jpg';
import img10 from '../assets/posle10.jpg';
import img11 from '../assets/posle11.jpg';
import img12 from '../assets/posle12.jpg';
import img13 from '../assets/posle13.jpg';
import img14 from '../assets/posle14.jpg';
import img16 from '../assets/posle16.jpg';

import img17 from '../assets/serv_1.jpg';
import img18 from '../assets/serv_2.jpg';
import img19 from '../assets/serv_3.jpg';
import img20 from '../assets/serv_4.jpg';
import img22 from '../assets/serv_6.jpg';
import img23 from '../assets/serv_7.jpg';

const sampleImages = [
  { id: '1', url: img1, alt: 'Фото 1' },
  { id: '2', url: img2, alt: 'Фото 2' },
  { id: '3', url: img3, alt: 'Фото 3' },
  { id: '4', url: img4, alt: 'Фото 4' },
  { id: '5', url: img5, alt: 'Фото 5' },
  { id: '6', url: img6, alt: 'Фото 6' },
  { id: '7', url: img7, alt: 'Фото 7' },
  { id: '8', url: img8, alt: 'Фото 8' },
  { id: '9', url: img9, alt: 'Фото 9' },
  { id: '10', url: img10, alt: 'Фото 10' },
  { id: '11', url: img11, alt: 'Фото 11' },
  { id: '12', url: img12, alt: 'Фото 12' },
  { id: '13', url: img13, alt: 'Фото 13' },
  { id: '14', url: img14, alt: 'Фото 14' },
  { id: '16', url: img16, alt: 'Фото 16' },
  { id: '17', url: img17, alt: 'Фото 17' },
  { id: '18', url: img18, alt: 'Фото 18' },
  { id: '19', url: img19, alt: 'Фото 19' },
  { id: '20', url: img20, alt: 'Фото 20' },
  { id: '22', url: img22, alt: 'Фото 22' },
  { id: '23', url: img23, alt: 'Фото 23' },
];


function Gallery() {
  return (
    <div className="container mx-auto">
      <h1 style={{ textAlign: 'center', margin: '24px 0', fontSize: '24px', fontWeight: 'bold' }}>Наши работы</h1>
      <ImageGallery images={sampleImages} />
    </div>
  );
}

export default Gallery;
