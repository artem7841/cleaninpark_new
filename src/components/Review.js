import React, { useState, useEffect } from "react";
import "../style/Review.css";
import ModalDiscount from "./ModalDiscount";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/reviews.json");
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const showAllReviews = () => {
    setVisibleCount(reviews.length);
  };

  const showLessReviews = () => {
    setVisibleCount(3);
  };

  if (loading) {
    return <div className="reviews-loading">Загрузка отзывов...</div>;
  }

  return (
    <div id="reviews" className="reviews-section">
      <h2 className="reviews-title">Отзывы наших клиентов</h2>

      <div className="avito-rating-badge">
        <div className="avito-rating-score">
          <span className="avito-number">4.9</span>
          <span className="avito-max">из 5</span>
        </div>
        <div className="avito-stars">

          <span className="avito-star-filled">★</span>
          <span className="avito-star-filled">★</span>
          <span className="avito-star-filled">★</span>
          <span className="avito-star-filled">★</span>
          <span className="avito-star-filled">★</span>
        </div>

        <a
          href="https://www.avito.ru/user/fe213175fe7f543b209df32dca76376b/profile?src=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="avito-link-btn"
        >
          Мы на Авито
        </a>
      </div>

      <div className="reviews-container">
        {reviews.slice(0, visibleCount).map((review, index) => (
          <div key={review.id || index} className="review-card">
            <div className="review-header">
              <div className="review-author">
                <div className="author-info">
                  <h3 className="author-name">{review.author}</h3>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
              <div className="review-rating">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
            </div>

            <div className="review-content">
              <p>{review.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="reviews-actions">
        {visibleCount < reviews.length ? (
          <button className="show-more-btn" onClick={showAllReviews}>
            Посмотреть еще отзывы
          </button>
        ) : (
          reviews.length > 3 && (
            <button className="show-less-btn" onClick={showLessReviews}>
              Свернуть отзывы
            </button>
          )
        )}
      </div>

      <button className="btn pulse-button" onClick={() => setIsModalOpen(true)} >
        Получить скидку
      </button>

      <ModalDiscount
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
    </div>
  );
};

export default Reviews;
