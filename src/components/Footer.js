import React from "react";
import tg from "../assets/tg_icon.png";
import whatsapp from "../assets/MAX.svg.webp";
import "../style/Footer.css";
import logo from "../assets/logo1.png";
import { useSiteConfig } from "../context/SiteConfigContext";

const Footer = () => {
  const { config } = useSiteConfig();
  const { company, contacts } = config;

  return (
    <footer className="footer">
      <div className="container3">
        <div className="footer-container">
          {/* Левая часть */}
          <div className="footer-left">
            <img src={logo} className="logo2" alt="logo" />
            <div className="footer-socials">
              <a
                href={contacts.whatsappUrl}
                className="social"
                aria-label="WhatsApp"
              >
                <img className="icon" src={whatsapp} alt="MAX" />
              </a>
              <a
                href={contacts.telegramUrl}
                className="social"
                aria-label="Telegram"
              >
                <img className="icon" src={tg} alt="Telegram" />
              </a>
            </div>
          </div>

          {/* Правая часть */}
          <div className="footer-right">
            <p className="footer-mail">{contacts.email}</p>
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="footer-bottom">
          <p>
            © {company.brandName}, {company.copyrightYear}
          </p>
          <p>
            {company.legalName}, ИНН {company.inn}
          </p>
          <p>
            Телефон:{" "}
            <a href={`tel:${contacts.phoneTelSecondary}`}>
              {contacts.phoneDisplaySecondary}
            </a>
            {" | "}
            {contacts.email}
          </p>
          <p>
            <a href="#privacy-policy">Политика обработки персональных данных</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
