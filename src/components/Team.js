import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { publicUrl } from "../utils/publicUrl";
import Reviews from "./Review.js";
import "../style/Potrfolio.css";

const Team = () => {
  const [beforeAfterSlides, setBeforeAfterSlides] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSimpleSlide, setCurrentSimpleSlide] = useState(0);
  const simpleSliderRef = useRef(null);
  const location = useLocation();

  // Хранение координат для свайпа
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(publicUrl("portfolio.json"));
        if (!response.ok) {
          throw new Error("Не удалось загрузить portfolio.json");
        }

        const data = await response.json();
        const slides = (data.beforeAfter || []).map((item) => ({
          before: publicUrl(item.before),
          after: publicUrl(item.after),
        }));
        const photos = (data.gallery || []).map((path) => publicUrl(path));

        setBeforeAfterSlides(slides);
        setGalleryPhotos(photos);
      } catch (error) {
        console.error("Ошибка загрузки галереи:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    if (
      currentSlide >= beforeAfterSlides.length &&
      beforeAfterSlides.length > 0
    ) {
      setCurrentSlide(0);
    }
  }, [beforeAfterSlides, currentSlide]);

  useEffect(() => {
    if (
      currentSimpleSlide >= galleryPhotos.length &&
      galleryPhotos.length > 0
    ) {
      setCurrentSimpleSlide(0);
    }
  }, [galleryPhotos, currentSimpleSlide]);

  const nextSlide = () => {
    if (!beforeAfterSlides.length) return;
    setCurrentSlide((prev) => (prev + 1) % beforeAfterSlides.length);
  };

  const prevSlide = () => {
    if (!beforeAfterSlides.length) return;
    setCurrentSlide(
      (prev) =>
        (prev - 1 + beforeAfterSlides.length) % beforeAfterSlides.length
    );
  };

  const nextSimpleSlide = () => {
    if (!galleryPhotos.length) return;
    setCurrentSimpleSlide((prev) => (prev + 1) % galleryPhotos.length);
  };

  const prevSimpleSlide = () => {
    if (!galleryPhotos.length) return;
    setCurrentSimpleSlide(
      (prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length
    );
  };

  // Логика свайпов
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (callbackNext, callbackPrev) => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Минимальная длина свайпа в пикселях

    if (distance > minSwipeDistance) {
      callbackNext(); // Свайп влево -> следующий слайд
    } else if (distance < -minSwipeDistance) {
      callbackPrev(); // Свайп вправо -> предыдущий слайд
    }

    // Сброс координат
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (loading) {
    return (
      <section className="portfolio" id="portfolio">
        <div className="container">
          <h2>Наши работы</h2>
          <div className="loading">Загрузка галереи...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <h2>Наши работы</h2>

        {beforeAfterSlides.length > 0 && (
          <div className="portfolio-slider">
            <div className="slider-container-wrapper">
              <div
                className="slider-container"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(nextSlide, prevSlide)}
              >
                <div className="static-image-block">
                  <div className="image-item">
                    <img
                      src={beforeAfterSlides[currentSlide].before}
                      alt="До уборки"
                      className="before-image"
                    />
                    <span className="static-label">До</span>
                  </div>
                  <div className="image-item">
                    <img
                      src={beforeAfterSlides[currentSlide].after}
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
              {beforeAfterSlides.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <Reviews />

        {galleryPhotos.length > 0 && (
          <div className="portfolio-slider simple-slider">
            <div className="slider-container-wrapper">
              <div
                className="slider-container simple-slider-container"
                ref={simpleSliderRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(nextSimpleSlide, prevSimpleSlide)}
              >
                <div className="image-wrapper simple-image-wrapper">
                  <img
                    src={galleryPhotos[currentSimpleSlide]}
                    alt="Наши работы"
                    className="simple-image"
                  />
                </div>

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
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
