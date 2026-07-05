import React, { useState, useEffect } from "react";
import "../style/Services.css";
import { Link, useNavigate } from "react-router-dom";
import { publicUrl } from "../utils/publicUrl";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
      console.error("Ошибка загрузки услуг:", error);
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
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
    <section id="services" className="services">
      <div className="container">
        <h2>Наши услуги</h2>
        {error && <div className="error-message">{error}</div>}

        {/* Изменили класс трека на контейнер сетки */}
        <div className="services-grid">
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
                    <p className="service-short-description">
                      {service.description}
                    </p>
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
    </section>
  );
};

export default Services;
