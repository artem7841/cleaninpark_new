import React from "react";
import tg from "../assets/tg_icon.png";
import whatsapp from "../assets/whatsapp_icon.png";
import "../style/Footer.css";
import { Omega } from "lucide-react";
import logo from "../assets/logo1.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container3">
  <div className="footer-container">
    {/* Левая часть */}
    <div className="footer-left">
      <img src={logo} className="logo2" alt="logo"/>
      <div className="footer-socials">
        <a href="https://wa.me/+79956623002" className="social" aria-label="WhatsApp">
          <img className="icon" src={whatsapp}/>
        </a>
        <a href="https://t.me/+79956623002" className="social" aria-label="Telegram">
          <img className="icon" src={tg}/>
        </a>
      </div>
    </div>

        {/* Правая часть */}
        <div className="footer-right">
          <p className="footer-mail">
            cleaninpark@yandex.ru
          </p>
        </div>
      </div>

      {/* Нижняя полоса */}
      <div className="footer-bottom">
        <p>© CleanInPark, 2025</p>
        <p>Лопатин Ярослав Михайлович, ИНН 667908332008</p>
  <p>Телефон: +7 (982) 716-62-07 | cleaninpark@yandex.ru</p>
  <p><a href="#privacy-policy">Политика обработки персональных данных</a></p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
