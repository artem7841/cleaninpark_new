import React, { useState, useEffect } from 'react';
import '../style/Review.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);

  // Загрузка данных из JSON файла
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/reviews.json');
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Функция для показа всех отзывов
  const showAllReviews = () => {
    setVisibleCount(reviews.length);
  };

  // Функция для скрытия части отзывов
  const showLessReviews = () => {
    setVisibleCount(3);
  };

  if (loading) {
    return <div className="reviews-loading">Загрузка отзывов...</div>;
  }

  return (
    <div id="reviews" className="reviews-section">
      <h2 className="reviews-title">Отзывы наших клиентов</h2>
      
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
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
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
    </div>
  );
};

export default Reviews;