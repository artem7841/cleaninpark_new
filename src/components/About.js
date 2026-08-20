
import React from "react";
import "../style/About.css";
import avatar from "../assets/avatar.jpg";
import { useSiteConfig } from "../context/SiteConfigContext";


const About = () => {
  const { config } = useSiteConfig();
  const { company } = config;

  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-content">
          {/* Текстовая часть */}
          <div className="about-text">
            <h2 className="about-title">
              Профессионализм — когда чистота становится системой
            </h2>
            <div className="about-description">
              <p>
                 Главная «боль» в клининге — бессистемность и зависимость от человеческого ресурса, и как следствие — непредсказуемость результата.
              </p>
              <p>
                 Мы создали CleanInPark как компанию, где качество — не случайность, а следствие продуманных до мелочей стандартов и процессов.
              </p>

            </div>

          </div>

          {/* Фото основателя */}
          <div className="about-image">
            <div className="founder-photo">
              <img
                src={avatar}
                className="founder-img"
              />
              <div className="photo-frame"></div>
            </div>
            <div className="founder-info">
              <p className="founder-name">Конова Ангелина</p>
              <p className="founder-role">{company.founderRole}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
