import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { publicUrl } from "../utils/publicUrl";
import Reviews from "./Review.js";
import "../style/Potrfolio.css";
import SimpleSlider from "./SimpleSlider";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { useNavigate } from 'react-router-dom';

const Portfolio = () => {
  const [beforeAfterSlides, setBeforeAfterSlides] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [teamWorkPhotos, setTeamWorkPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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
        const teamPhotos = (data.teamwork || []).map((path) => publicUrl(path));

        setBeforeAfterSlides(slides);
        setGalleryPhotos(photos);
        setTeamWorkPhotos(teamPhotos);
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

        <BeforeAfterSlider slides={beforeAfterSlides} />
        <button className="show-more-btn"  onClick={() => navigate(`/gallery`)}>
          Посмотреть больше работ
        </button>

        <Reviews />

        {teamWorkPhotos.length > 0 && (
          <SimpleSlider images={teamWorkPhotos} title="Работа команды" />
        )}
        <button className="show-more-btn"  onClick={() => navigate(`/gallery-teamwork`)}>
          Посмотреть больше работ
        </button>
      </div>
    </section>
  );
};

export default Portfolio;
