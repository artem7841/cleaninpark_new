import React, { useState, useEffect, useRef } from 'react';

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const showNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const closeModal = () => {
    setCurrentIndex(null);
    document.body.style.overflow = 'auto';
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      showNext();
    } else if (swipeDistance < -minSwipeDistance) {
      showPrev();
    }
  };

  useEffect(() => {
    if (currentIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const activeImage = currentIndex !== null ? images[currentIndex] : null;

  return (
    <div style={styles.container}>
      <div style={styles.grid} className="gallery-grid">
        {images.map((img, index) => (
          <div
            key={img.id || index}
            style={styles.card}
            onClick={() => openModal(index)}
          >
            <img src={img.url} alt={img.alt} style={styles.image} />
          </div>
        ))}
      </div>

      {activeImage && (
        <div
          style={styles.modalOverlay}
          onClick={closeModal}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button style={styles.closeButton} onClick={closeModal}>&times;</button>

          <button style={styles.arrowLeft} className="desktop-arrow" onClick={showPrev}>&#10094;</button>

          <img
            src={activeImage.url}
            alt={activeImage.alt}
            style={styles.modalImage}
            className="modal-img-responsive"
            onClick={(e) => e.stopPropagation()}
          />


          <button style={styles.arrowRight} className="desktop-arrow" onClick={showNext}>&#10095;</button>
        </div>
      )}


      <style>{`
        /* На мобильных (экран меньше 768px) */
        .desktop-arrow {
          display: none !important; /* Полностью прячем стрелки */
        }
        .modal-img-responsive {
          max-width: 96% !important; /* Фото занимает почти весь экран по ширине */
          max-height: 85vh !important;
        }

        /* На компьютерах и планшетах (экран от 768px) */
        @media (min-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
          .desktop-arrow {
            display: block !important; /* Показываем стрелки на ПК */
          }
          .modal-img-responsive {
            max-width: 80% !important; /* Оставляем место для стрелок по бокам */
          }
        }
      `}</style>
    </div>
  );
};

// Базовые стили
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px',
  },
  card: {
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    borderRadius: '12px',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalImage: {
    objectFit: 'contain',
    borderRadius: '4px',
    userSelect: 'none',
    transition: 'transform 0.1s ease',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '44px',
    fontWeight: '300',
    cursor: 'pointer',
    zIndex: 10000,
  },
  arrowLeft: {
    position: 'absolute',
    left: '24px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '36px',
    cursor: 'pointer',
    padding: '10px',
    userSelect: 'none',
    zIndex: 10000,
  },
  arrowRight: {
    position: 'absolute',
    right: '24px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '36px',
    cursor: 'pointer',
    padding: '10px',
    userSelect: 'none',
    zIndex: 10000,
  },
};

export default ImageGallery;
