import React, { useState } from "react";

const BeforeAfterSlider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  if (!slides || slides.length === 0) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches.clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches.clientX);
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
    <div className="portfolio-slider">
      <div className="slider-container-wrapper">
        <div
          className="slider-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="static-image-block">
            <div className="image-item">
              <img
                src={slides[currentSlide].before}
                alt="До уборки"
                className="before-image"
              />
              <span className="static-label">До</span>
            </div>
            <div className="image-item">
              <img
                src={slides[currentSlide].after}
                alt="После уборки"
                className="after-image"
              />
              <span className="static-label">После</span>
            </div>
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
        {slides.map((_, index) => (
          <button
            key={index}
            className={`nav-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
