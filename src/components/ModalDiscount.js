import React, { useState, useEffect } from 'react';
import '../style/ModalDiscount.css';

const ModalDiscount = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Если окно не должно быть открыто, ничего не рендерим
  if (!isOpen) return null;


  // Функция для отправки данных в Google Forms
  const submitToGoogleForms = async (phoneNumber) => {
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSepPfrOsTsx8e0veqjDfQ7es8DnP8MpSxY9xJxB_VyQk_z60Q/formResponse";

    // Создаем FormData с нужными полями
    const formData = new FormData();

    // Поля Google Forms
    const fields = {
      'entry.1803102575': '',
      'entry.1496045372': phoneNumber,
      'entry.392138171': '',
      'entry.1639246950': 'Заявка со скидкой 10%',
      'entry.749667160': '',
      'entry.1761612622': '',
      'entry.1146187820': 'СКИДКА 10% на первый заказ от 10000 рублей',
      'entry.consent_timestamp': new Date().toISOString(),
      'entry.privacy_consent': 'Да',
      'entry.data_processing_consent': 'Да'
    };

    // Добавляем поля в FormData
    Object.entries(fields).forEach(([name, value]) => {
      formData.append(name, value);
    });

    try {
      // Основной способ отправки
      await fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      console.log('✅ Данные скидки отправлены в Google Forms');
      return true;

    } catch (error) {
      console.error('❌ Ошибка отправки, пробуем fallback:', error);


      return await submitToGoogleFormsFallback(phoneNumber);
    }
  };


  const submitToGoogleFormsFallback = (phoneNumber) => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'google-form-discount-iframe';

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = "https://docs.google.com/forms/d/e/1FAIpQLSepPfrOsTsx8e0veqjDfQ7es8DnP8MpSxY9xJxB_VyQk_z60Q/formResponse";
      form.target = 'google-form-discount-iframe';
      form.style.display = 'none';

      // Поля для отправки
      const fields = {
        'entry.1803102575': '',
        'entry.1496045372': phoneNumber,
        'entry.392138171': '',
        'entry.1639246950': 'Заявка со скидкой 10%',
        'entry.749667160': '',
        'entry.1761612622': '',
        'entry.1146187820': 'СКИДКА 10% на первый заказ от 10000 рублей',
        'entry.consent_timestamp': new Date().toISOString(),
        'entry.privacy_consent': 'Да',
        'entry.data_processing_consent': 'Да'
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(iframe);
      document.body.appendChild(form);

      form.submit();

      setTimeout(() => {
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        resolve(true);
      }, 1000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phone.length >= 10 && agreed) {
      setIsSubmitting(true);

      try {
        // Отправляем данные в Google Forms
        const success = await submitToGoogleForms(phone);

        if (success) {
          setIsSubmitted(true);

          // Закрываем окно через 2 секунды после успешной отправки
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
        }
      } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const formatPhone = (value) => {
    if (!value) return '+7';
    if (value.startsWith('7')) {
      value = value.substring(1);
    }
    const match = value.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (match) {
      return `+7 (${match[1]}) ${match[2]}${match[3] ? '-' + match[3] : ''}${match[4] ? '-' + match[4] : ''}`;
    }
    return `+7 (${value}`;
  };



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {!isSubmitted ? (
          <>
            <div className="modal-header">
              <div className="discount-badge">10%</div>
              <h2 className="modal-title">Скидка 10% на первый заказ</h2>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                Хотите, чтобы ваш дом сиял? Сервис CleanInPark предлагает вам скидку 10%
                на первый заказ любого вида уборки от 10 000 рублей! Доверьте уборку
                профессионалам и наслаждайтесь чистотой без лишних хлопот.
              </p>

              <form onSubmit={handleSubmit} className="discount-form">
                <label className="form-label">
                  Введите номер телефона, чтобы оформить заказ со скидкой 10%.
                </label>

                <div className="phone-input-container">
                  <input
                    type="tel"
                    value={formatPhone(phone)}
                    onChange={handlePhoneChange}
                    className="phone-input"
                    placeholder="+7 (___) ___-__-__"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-controls">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="checkbox-input"
                      required
                      disabled={isSubmitting}
                    />
                    <span className="checkmark"></span>
                    Согласен на обработку персональных данных
                  </label>

                  <button
                    type="submit"
                    className="btn2"
                    disabled={!agreed || phone.length < 10 || isSubmitting}
                  >
                    {isSubmitting ? 'Отправляем...' : 'Получить скидку!'}
                  </button>
                </div>
              </form>

              <div className="terms">
                <small>
                  Скидка действует на первый заказ от 10 000 рублей. Не суммируется с другими акциями.
                </small>
              </div>
            </div>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Спасибо за заявку!</h3>
            <p>Ваш номер телефона принят. Мы свяжемся с вами в ближайшее время для оформления заказа со скидкой 15%.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDiscount;
