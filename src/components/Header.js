import React, { useState } from "react";
import main from "../assets/main_image.png";
import logo from "../assets/logo1.png";
import "../style/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Функция для плавной прокрутки к разделу
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Закрываем меню после клика на мобильных
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false);
    }
  };

  // Меню навигации
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
      {/* Навигационная панель над хедером */}
      <nav className="navigation-bar">
        <div className="container">
          <div className="nav-container">
            
            
            {/* Горизонтальное меню для десктопа */}
            <div className="desktop-nav-menu">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => scrollToSection(item.id)}
                      className="nav-menu-link"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-right">
              {/* <button className="pulse-button" onClick={() => scrollToSection('contact')}>Связаться</button> */}
              {/* <div className="nav-phone">+7 (995) 662-30-02</div> */}
              
              {/* Бургер-иконка для мобильных */}
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
          {/* Кнопка закрытия (крестик) */}
          <button 
            className="close-menu"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Закрыть меню"
          >
            ✕
          </button>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => scrollToSection(item.id)}
                  className="mobile-menu-link"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Основной хедер */}
      <header id="header" className="header">
        
        <div className="container">
          <div className="top-bar">
          <div className="top-bar-left">
            <img src={logo} className="logo" alt="logo"/>
          </div>
          <div className="top-bar-right">
            <a  className="nav-phone"  href="tel:+79956623002" 
                  data-desktop-message="Позвонить? Откроется приложение для звонков">
                  <span className="nav-phone">+7 (995) 662-30-02</span>
                </a>

            <button className="pulse-button" onClick={() => scrollToSection('contact')}>Связаться</button>
          </div>
        </div>
          <div className="header-content">
            <div className="header-text">
              <h1>Профессиональная уборка квартир, домов, офисов в Екатеринбурге.</h1>

                <button 
                  className="btn pulse-button" 
                  onClick={() => scrollToSection('calculator')}
                >
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