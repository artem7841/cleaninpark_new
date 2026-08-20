import React, { useState } from "react";
import main from "../assets/main_image.jpg";
import logo from "../assets/logo1.png";
import backgroundVideo from "../assets/video.mp4";
import "../style/Header.css";
import { useSiteConfig } from "../context/SiteConfigContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { config } = useSiteConfig();
  const { contacts } = config;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { id: 'about', label: 'О компании' },
    { id: 'advantages', label: 'Преимущества' },
    { id: 'services', label: 'Услуги' },
    { id: 'services', label: 'Цены' },
    { id: 'portfolio', label: 'Галерея' },
    { id: 'calculator', label: 'Калькулятор' },
    { id: 'contact', label: 'Контакты' },
    { id: 'reviews', label: 'Отзывы' },
  ];

  return (
    <>
      {/* Навигационная панель */}
      <nav className="navigation-bar">
        <div className="container">
          <div className="nav-container">
            <div className="desktop-nav-menu">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button onClick={() => scrollToSection(item.id)} className="nav-menu-link">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav-right">
              <button
                className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Меню"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Мобильное меню */}
      <div className={`mobile-nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="container">
          <button className="close-menu" onClick={() => setIsMenuOpen(false)} aria-label="Закрыть меню">✕</button>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button onClick={() => scrollToSection(item.id)} className="mobile-menu-link">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Основной хедер */}
      <header id="header" className="header">
        <div className="header-video-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            defaultMuted
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        </div>


        <div className="container">
          <div className="top-bar">
            <div className="top-bar-left">
              <img src={logo} className="logo" alt="logo"/>
            </div>
            <div className="top-bar-right">
              <a className="nav-phone" href={`tel:${contacts.phoneTel}`}>
                <span className="nav-phone">{contacts.phoneDisplay}</span>
              </a>
              <button className="pulse-button" onClick={() => scrollToSection('contact')}>Связаться</button>
            </div>
          </div>

          <div className="header-content">
            <div className="header-text">
              <h1>Генеральная и поддерживающая уборка • Клининг после ремонта • Химчистка мебели • Мойка окон • Озонирование помещений</h1>
              <button className="btn pulse-button" onClick={() => scrollToSection('calculator')}>
                Рассчитать стоимость
              </button>
            </div>
            <div className="header-image">
              <img src={main} alt="cleaning" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
