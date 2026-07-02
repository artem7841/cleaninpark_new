import React, { useState, useEffect, useRef } from "react";
import "../style/Services.css";
import { Link, useNavigate } from "react-router-dom";
import { publicUrl } from "../utils/publicUrl";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(publicUrl("services.json"));

      if (!response.ok) {
        throw new Error(`HTTP ошибка ${response.status}`);
      }

      const jsonData = await response.json();

      if (jsonData && jsonData.services) {
        const enrichedServices = jsonData.services.map((service) => ({
          ...service,
          img: publicUrl(service.img),
        }));
        setServices(enrichedServices);
      }
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (sliderRef.current) {
      const card = sliderRef.current.querySelector('.service-card');
      if (card) {
        const cardWidth = card.offsetWidth + 20;
        sliderRef.current.scrollBy({
          left: cardWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      const card = sliderRef.current.querySelector('.service-card');
      if (card) {
        const cardWidth = card.offsetWidth + 20;
        sliderRef.current.scrollBy({
          left: -cardWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleMobileClick = (link) => {
    if (window.innerWidth <= 1024) {
      navigate(link);
    }
  };

  if (loading) {
    return (
      <section className="services">
        <div className="container">
          <h2>Наши услуги</h2>
          <div className="loading">Загрузка услуг...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="services"  className="services">
      <div className="container">
        <h2>Наши услуги</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="services-slider">
          <div className="services-track" ref={sliderRef}>
            {services.map((service) => (
              <div 
                key={service.id} 
                className="service-card"
                onClick={() => handleMobileClick(service.link)}
              >
                <div className="service-card-inner">
                  <div 
                    className="service-card-front"
                    style={{ backgroundImage: `url(${service.img})` }}
                  >
                    <p className="service-card-title">{service.title}</p>
                  </div>
                  
                  <div className="service-card-content">
                    <div className="service-card-description">
                      <p className="service-price">{service.price}</p>
                      <Link 
                        to={service.link} 
                        className="service-details-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Читать подробное описание →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="slider-controls">
          <button className="slider-prev" onClick={prevSlide}>‹</button>
          <button className="slider-next" onClick={nextSlide}>›</button>
        </div>
      </div>
    </section>
  );
};

export default Services;
