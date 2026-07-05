import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { publicUrl } from "../utils/publicUrl";
import Reviews from "./Review.js";

const Portfolio = () => {
  const [beforeAfterSlides, setBeforeAfterSlides] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
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
        behavior: "smooth",
        block: "start",
      });
    }
  };

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

  const handleMove = (e) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const percentage = (x / containerRect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setSliderPosition(clampedPercentage);
  };

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleMouseUp);
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
    if (!beforeAfterSlides.length) return;
    setCurrentSlide((prev) => (prev + 1) % beforeAfterSlides.length);
    setSliderPosition(50);
  };

  const prevSlide = () => {
    if (!beforeAfterSlides.length) return;
    setCurrentSlide(
      (prev) =>
        (prev - 1 + beforeAfterSlides.length) % beforeAfterSlides.length,
    );
    setSliderPosition(50);
  };

  const nextSimpleSlide = () => {
    if (!galleryPhotos.length) return;
    setCurrentSimpleSlide((prev) => (prev + 1) % galleryPhotos.length);
  };

  const prevSimpleSlide = () => {
    if (!galleryPhotos.length) return;
    setCurrentSimpleSlide(
      (prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length,
    );
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
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onTouchMove={handleTouchMove}
              >
                <div className="image-wrapper">
                  <img
                    src={beforeAfterSlides[currentSlide].before}
                    alt="До уборки"
                    className="before-image"
                  />
                  <img
                    src={beforeAfterSlides[currentSlide].after}
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
                  onClick={() => {
                    setCurrentSlide(index);
                    setSliderPosition(50);
                  }}
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

            <div className="slider-navigation">
              {galleryPhotos.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentSimpleSlide ? "active" : ""}`}
                  onClick={() => setCurrentSimpleSlide(index)}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => scrollToSection("contact")}
          className="btn btn-anim"
        >
          Получить расчет стоимости
        </button>
      </div>
    </section>
  );
};

export default Portfolio;
