import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import do1 from "../assets/do1.jpg";
import posle1 from "../assets/posle1.jpg";
import do2 from "../assets/do2.jpg";
import posle2 from "../assets/posle2.jpg";
import do3 from "../assets/do3.jpg";
import posle3 from "../assets/posle3.jpg";
import do4 from "../assets/do4.jpg";
import posle4 from "../assets/posle4.jpg";
import do5 from "../assets/do5.jpg";
import posle5 from "../assets/posle5.jpg";
import do6 from "../assets/do6.jpg";
import posle6 from "../assets/posle6.jpg";
import do7 from "../assets/do7.jpg";
import posle7 from "../assets/posle7.jpg";
import do8 from "../assets/do8.jpg";
import posle8 from "../assets/posle8.jpg";
import do9 from "../assets/do9.jpg";
import posle9 from "../assets/posle9.jpg";
import do10 from "../assets/do10.jpg";
import posle10 from "../assets/posle10.jpg";
import do11 from "../assets/do11.jpg";
import posle11 from "../assets/posle11.jpg";
import do12 from "../assets/do12.jpg";
import posle12 from "../assets/posle12.jpg";
import do13 from "../assets/do13.jpg";
import posle13 from "../assets/posle13.jpg";
import do14 from "../assets/do14.jpg";
import posle14 from "../assets/posle14.jpg";
import posle15 from "../assets/do15.jpg";
import do15 from "../assets/posle15.jpg";
import do16 from "../assets/do16.jpg";
import posle16 from "../assets/posle16.jpg";

// Импортируем дополнительные фото для обычного слайдера
import photo1 from "../assets/serv_1.jpg";
import photo2 from "../assets/serv_2.jpg";
import photo3 from "../assets/serv_3.jpg";
import photo4 from "../assets/serv_4.jpg";

import photo6 from "../assets/serv_6.jpg";

const Portfolio = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSimpleSlide, setCurrentSimpleSlide] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const simpleSliderRef = useRef(null);
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  useEffect(() => {
    // Обработка якорных ссылок
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Небольшая задержка для полной загрузки страницы
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [location]);

  const images = [
    {
      before: do1,
      after: posle1
    },
    {
      before: do2,
      after: posle2
    },
    {
      before: do3,
      after: posle3
    },
    {
      before: do4,
      after: posle4
    },
    {
      before: do5,
      after: posle5
    },
    {
      before: do6,
      after: posle6
    },
    {
      before: do7,
      after: posle7
    },
    {
      before: do8,
      after: posle8
    },
    {
      before: do9,
      after: posle9
    },
    {
      before: do10,
      after: posle10
    },
    {
      before: do11,
      after: posle11
    },
    {
      before: do12,
      after: posle12
    },
    {
      before: do13,
      after: posle13
    },
    {
      before: do14,
      after: posle14
    },
    {
      before: do15,
      after: posle15
    },
    {
      before: do16,
      after: posle16
    },
  ];

  // Массив с обычными фотками
  const simplePhotos = [
    photo1,
    photo2,
    photo3,
    photo4,

    photo6,
    // Можно добавить больше фото по необходимости
  ];

  const handleMove = (e) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const percentage = (x / containerRect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    setSliderPosition(clampedPercentage);
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - containerRect.left;
    const percentage = (x / containerRect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    setSliderPosition(clampedPercentage);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setSliderPosition(50);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setSliderPosition(50);
  };

  const nextSimpleSlide = () => {
    setCurrentSimpleSlide((prev) => (prev + 1) % simplePhotos.length);
  };

  const prevSimpleSlide = () => {
    setCurrentSimpleSlide((prev) => (prev - 1 + simplePhotos.length) % simplePhotos.length);
  };

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <h2>Наши работы</h2>
        
        {/* Слайдер "До/После" */}
        <div className="portfolio-slider">

          
          <div className="slider-container-wrapper">
            <div 
              className="slider-container"
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchMove={handleTouchMove}
            >
              <div className="image-wrapper">
                <img 
                  src={images[currentSlide].before} 
                  alt="До уборки" 
                  className="before-image"
                />
                <img 
                  src={images[currentSlide].after} 
                  alt="После уборки" 
                  className="after-image"
                  style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                />
              </div>
              
              <div 
                className="slider-handle"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                <div className="slider-line"></div>
                <div className="slider-button">
                  <span>⟷</span>
                </div>
              </div>

              <div className="slider-labels">
                <span className="label-before">До</span>
                <span className="label-after">После</span>
              </div>

              {/* Стрелки поверх фото */}
              <button 
                className="slider-arrow slider-arrow-prev"
                onClick={prevSlide}
                aria-label="Предыдущее фото"
              >
                ‹
              </button>

              <button 
                className="slider-arrow slider-arrow-next"
                onClick={nextSlide}
                aria-label="Следующее фото"
              >
                ›
              </button>
            </div>
          </div>

          {/* Навигация по слайдам (точки) */}
          <div className="slider-navigation">
            {images.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSlide(index);
                  setSliderPosition(50);
                }}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Простой слайдер с фотками */}
        <div className="portfolio-slider simple-slider">

          
          <div className="slider-container-wrapper">
            <div 
              className="slider-container simple-slider-container"
              ref={simpleSliderRef}
            >
              <div className="image-wrapper simple-image-wrapper">
                <img 
                  src={simplePhotos[currentSimpleSlide]} 
                  alt="Наши работы" 
                  className="simple-image"
                />
              </div>

              {/* Стрелки поверх фото */}
              <button 
                className="slider-arrow slider-arrow-prev"
                onClick={prevSimpleSlide}
                aria-label="Предыдущее фото"
              >
                ‹
              </button>

              <button 
                className="slider-arrow slider-arrow-next"
                onClick={nextSimpleSlide}
                aria-label="Следующее фото"
              >
                ›
              </button>
            </div>
          </div>

          {/* Навигация по слайдам (точки) */}
          <div className="slider-navigation">
            {simplePhotos.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentSimpleSlide ? 'active' : ''}`}
                onClick={() => setCurrentSimpleSlide(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <button 
          onClick={() => scrollToSection("contact")}
          className="btn btn-anim">

          Получить расчет стоимости
        </button>
      </div>
    </section>
  );
};

export default Portfolio;