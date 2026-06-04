import React, { useState, useEffect, useRef } from "react";
import "../style/Services.css";
import { Link, useNavigate } from "react-router-dom";

// Импортируем все изображения
import serv_1 from "../assets/serv_1.jpg";
import serv_2 from "../assets/serv_2.jpg";
import serv_3 from "../assets/serv_3.jpg";
import serv_4 from "../assets/serv_4.jpg";
import serv_5 from "../assets/serv5.jpg";
import serv_6 from "../assets/posle2.jpg";
import serv_7 from "../assets/serv_7.jpg";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const sliderRef = useRef(null);


  const imageMap = {
    "/assets/serv_1.jpg": serv_1,
    "/assets/serv_2.jpg": serv_2,
    "/assets/serv_3.jpg": serv_3,
    "/assets/serv_4.jpg": serv_4,
    "/assets/serv_5.jpg": serv_5,
    "/assets/serv_6.jpg": serv_6,
    "/assets/serv_7.jpg": serv_7,

  };



  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Пробуем разные пути к JSON файлу
      const possiblePaths = [
        "/services.json", // public folder

  
      ];

      let jsonData = null;
      let successfulPath = null;
      
      for (const path of possiblePaths) {
        try {
          console.log(`Пробуем загрузить из: ${path}`);
          const response = await fetch(path);
          
          if (response.ok) {
            const text = await response.text();
            console.log('Получен ответ:', text.substring(0, 100)); // Логируем начало ответа

            // Проверяем, что ответ действительно JSON
            if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
              jsonData = JSON.parse(text);
              successfulPath = path;
              console.log('✅ Успешно загружено из:', path);
              break;
            } else {
              console.log('❌ Ответ не JSON:', path);
            }
          } else {
            console.log(`❌ HTTP ошибка ${response.status}:`, path);
          }
        } catch (e) {
          console.log(`❌ Ошибка загрузки из ${path}:`, e.message);
          continue;
        }
      }

      if (jsonData && jsonData.services) {
        // Обогащаем данные реальными изображениями
        const enrichedServices = jsonData.services.map(service => ({
          ...service,
          // Если в JSON указано имя изображения, используем маппинг, иначе оставляем как есть
          img: imageMap[service.img] || service.img
        }));
        setServices(enrichedServices);
        console.log('✅ Данные установлены из JSON файла');
      } 

    } catch (error) {
      console.error('❌ Ошибка загрузки услуг:', error);
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