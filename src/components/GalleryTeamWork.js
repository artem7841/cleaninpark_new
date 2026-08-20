import React from 'react';
import ImageGallery from './ImageGallery';

const sampleImages = [
  { id: '1', url: '/images/portfolio/teamwork/01.jpg', alt: 'Уборка фасада' },
  { id: '2', url: '/images/portfolio/teamwork/02.jpg', alt: 'Уборка бильярдной' },
  { id: '3', url: '/images/portfolio/teamwork/03.jpg', alt: 'Чистка плитки' },
  { id: '4', url: '/images/portfolio/teamwork/04.jpg', alt: 'Мытье окон' },
  { id: '5', url: '/images/portfolio/teamwork/05.jpg', alt: 'Химчистка ванной' },
  { id: '6', url: '/images/portfolio/teamwork/06.jpg', alt: 'Протирка поверхностей' },
  { id: '7', url: '/images/portfolio/teamwork/07.jpg', alt: 'Мытье панорамных окон' },
  { id: '8', url: '/images/portfolio/teamwork/08.jpg', alt: 'Чистка духовки' },
  { id: '9', url: '/images/portfolio/teamwork/09.jpg', alt: 'Работа с пылесосом' },
  { id: '10', url: '/images/portfolio/teamwork/10.jpg', alt: 'Уборка кухни' },
  { id: '11', url: '/images/portfolio/teamwork/11.jpg', alt: 'Уборка балкона' },
  { id: '12', url: '/images/portfolio/teamwork/12.jpg', alt: 'Мытье балконного остекления' },
  { id: '13', url: '/images/portfolio/teamwork/13.jpg', alt: 'Химчистка ковра' },
];

function Gallery() {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', margin: '24px 0', fontSize: '24px', fontWeight: 'bold' }}>
        Наша команда
      </h1>
      <ImageGallery images={sampleImages} />
    </div>
  );
}

export default Gallery;
