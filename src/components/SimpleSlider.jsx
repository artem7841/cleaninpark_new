import React, { useState } from "react";
import "../style/Potrfolio.css";

const SimpleSlider = ({ images, title }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Минимум пикселей для срабатывания свайпа
  const minSwipeDistance = 50;

  if (!images || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="portfolio-slider simple-slider teamwork-slider" style={{ marginTop: "40px" }}>
      {title && <h2>{title}</h2>}
      <div className="slider-container-wrapper">
        <div
          className="slider-container simple-slider-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="image-wrapper simple-image-wrapper">
            <img
              src={images[currentSlide]}
              alt="Слайд галереи"
              className="simple-image"
            />
          </div>

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

      <div className="slider-navigation">
        {images.map((_, index) => (
          <button
            key={index}
            className={`nav-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Перейти к фото ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleSlider;
