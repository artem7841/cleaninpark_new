import React, { useState, useEffect, useRef } from "react";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    contactMethod: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    contactMethod: "",
    privacyPolicyRead: "",
    dataProcessing: ""
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    contactMethod: false,
    privacyPolicyRead: false,
    dataProcessing: false
  });

  const [consents, setConsents] = useState({
    privacyPolicyRead: false,    
    dataProcessing: false        
  });

  const [calculatorData, setCalculatorData] = useState(null);
  const hasLoadedCalculatorData = useRef(false);
  const formRef = useRef(null);

  // Валидация имени
  const validateName = (name) => {
    if (!name.trim()) {
      return "Введите имя";
    }
    if (name.trim().length < 2) {
      return "Имя должно содержать минимум 2 символа";
    }
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name.trim())) {
      return "Имя может содержать только буквы и дефисы";
    }
    return "";
  };

  // Валидация телефона
  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return "Введите телефон";
    }
    
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    if (cleanPhone.length < 10) {
      return "Телефон должен содержать минимум 10 цифр";
    }
    if (cleanPhone.length > 15) {
      return "Телефон слишком длинный";
    }
    if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      return "Введите корректный номер телефона";
    }
    return "";
  };

  // Валидация способа связи
  const validateContactMethod = (method) => {
    if (!method) {
      return "Выберите предпочтительный способ связи";
    }
    return "";
  };

  // Валидация ознакомления с политикой
  const validatePrivacyPolicyRead = (read) => {
    if (!read) {
      return "Необходимо ознакомиться с политикой конфиденциальности";
    }
    return "";
  };

  // Валидация согласия на обработку данных
  const validateDataProcessing = (accepted) => {
    if (!accepted) {
      return "Необходимо дать согласие на обработку персональных данных";
    }
    return "";
  };

  // Общая валидация формы
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      phone: validatePhone(formData.phone),
      contactMethod: validateContactMethod(formData.contactMethod),
      privacyPolicyRead: validatePrivacyPolicyRead(consents.privacyPolicyRead),
      dataProcessing: validateDataProcessing(consents.dataProcessing)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  // Валидация отдельного поля
  const validateField = (name, value, isTouched) => {
    if (!isTouched) return "";
    
    switch (name) {
      case 'name':
        return validateName(value);
      case 'phone':
        return validatePhone(value);
      case 'contactMethod':
        return validateContactMethod(value);
      case 'privacyPolicyRead':
        return validatePrivacyPolicyRead(value);
      case 'dataProcessing':
        return validateDataProcessing(value);
      default:
        return "";
    }
  };

  // Обработчики для чекбоксов согласий
  const handleConsentChange = (consentName, checked) => {
    setConsents(prev => ({
      ...prev,
      [consentName]: checked
    }));

    if (touched[consentName]) {
      const error = validateField(consentName, checked, true);
      setErrors(prev => ({ ...prev, [consentName]: error }));
    }
  };

  // Функция для загрузки данных из sessionStorage
  const loadCalculatorDataFromStorage = () => {
    try {
      const savedCalculatorData = sessionStorage.getItem('calculatorData');
      console.log('🔍 Данные в sessionStorage:', savedCalculatorData);
      
      if (savedCalculatorData) {
        const data = JSON.parse(savedCalculatorData);
        console.log('📦 Данные из sessionStorage:', data);
        
        // Проверяем, что данные не устарели (менее 5 минут)
        const isDataFresh = !data.timestamp || (Date.now() - data.timestamp) < 5 * 60 * 1000;
        
        if (isDataFresh) {
          setCalculatorData(data);
          
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            phone: data.phone || ''
          }));
          
          const newTouched = {
            name: !!data.name,
            phone: !!data.phone,
            contactMethod: false,
            privacyPolicyRead: false,
            dataProcessing: false
          };
          setTouched(newTouched);
          
          const newErrors = {
            name: validateName(data.name || ''),
            phone: validatePhone(data.phone || ''),
            contactMethod: "",
            privacyPolicyRead: "",
            dataProcessing: ""
          };
          setErrors(newErrors);
          
          hasLoadedCalculatorData.current = true;
          console.log('✅ Данные успешно загружены из sessionStorage');
          
          return true;
        } else {
          console.log('❌ Данные устарели, очищаем');
          sessionStorage.removeItem('calculatorData');
        }
      }
      return false;
    } catch (error) {
      console.error('❌ Ошибка загрузки из sessionStorage:', error);
      return false;
    }
  };

  // Функция для проверки обновлений данных в реальном времени
  const checkForDataUpdates = () => {
    const savedCalculatorData = sessionStorage.getItem('calculatorData');
    if (savedCalculatorData) {
      const data = JSON.parse(savedCalculatorData);
      
      // Проверяем, изменились ли данные
      if (!calculatorData || data.timestamp !== calculatorData.timestamp) {
        console.log('🔄 Обнаружены обновленные данные, загружаем...');
        loadCalculatorDataFromStorage();
      }
    }
  };

  // Функция для загрузки сохраненных данных формы
  const loadSavedFormData = () => {
    try {
      const savedFormData = sessionStorage.getItem('contactsFormData');
      const savedConsents = sessionStorage.getItem('contactsConsents');
      
      if (savedFormData && !hasLoadedCalculatorData.current) {
        const data = JSON.parse(savedFormData);
        setFormData(data);
        
        const newErrors = {
          name: "",
          phone: "", 
          contactMethod: "",
          privacyPolicyRead: "",
          dataProcessing: ""
        };
        setErrors(newErrors);
      }
      
      if (savedConsents) {
        setConsents(JSON.parse(savedConsents));
      }
    } catch (error) {
      console.error('Ошибка загрузки сохраненных данных формы:', error);
    }
  };

  // Основная загрузка при монтировании
  useEffect(() => {
    console.log('🚀 Компонент Contacts смонтирован');
    
    // Загружаем данные из sessionStorage
    loadCalculatorDataFromStorage();
    
    // Загружаем сохраненные данные формы
    loadSavedFormData();

    // Слушаем события изменения hash (переход к контактам)
    const handleHashChange = () => {
      console.log('🔄 Хеш изменился:', window.location.hash);
      if (window.location.hash === '#contact') {
        // При скролле к контактам проверяем актуальные данные
        console.log('🎯 Прокрутка к контактам, проверяем данные...');
        setTimeout(() => {
          checkForDataUpdates();
        }, 100);
      }
    };

    const handleCalculatorData = (event) => {
      console.log('📨 Получены данные от калькулятора через event:', event.detail);
      if (event.detail) {
        setCalculatorData(event.detail);
        setFormData(prev => ({
          ...prev,
          name: event.detail.name || '',
          phone: event.detail.phone || ''
        }));
        hasLoadedCalculatorData.current = true;
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'calculatorData') {
        console.log('📊 Обнаружено изменение в sessionStorage');
        setTimeout(() => {
          checkForDataUpdates();
        }, 100);
      }
    };

    const intervalId = setInterval(() => {
      checkForDataUpdates();
    }, 1000);

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('calculatorDataSaved', handleCalculatorData);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('calculatorDataSaved', handleCalculatorData);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  
  useEffect(() => {
 
    if (window.location.hash === '#contact') {
      console.log('📍 Страница загружена сразу на контактах, загружаем данные...');
      setTimeout(() => {
        loadCalculatorDataFromStorage();
      }, 500);
    }
  }, []);

  // Сохранение данных формы при изменении
  useEffect(() => {
    sessionStorage.setItem('contactsFormData', JSON.stringify(formData));
    sessionStorage.setItem('contactsConsents', JSON.stringify(consents));
  }, [formData, consents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      const error = validateField(name, value, true);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    const error = validateField(name, value, true);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Функция для логирования согласий (важно для доказательства)
  const logConsents = async () => {
    try {
      const consentData = {
        timestamp: new Date().toISOString(),
        name: formData.name,
        phone: formData.phone,
        privacyPolicyRead: consents.privacyPolicyRead,
        dataProcessing: consents.dataProcessing,
        userAgent: navigator.userAgent,
        service: calculatorData?.service || 'Прямой запрос'
      };

      // Сохраняем в sessionStorage для доказательства
      sessionStorage.setItem('consentLog', JSON.stringify(consentData));
      
      // Можно также отправить на сервер
      console.log('✅ Согласия залогированы:', consentData);
      
    } catch (error) {
      console.error('Ошибка логирования согласий:', error);
    }
  };

  // Получение текстового описания способа связи
  const getContactMethodText = (method) => {
    switch (method) {
      case 'telegram':
        return 'Telegram';
      case 'whatsapp':
        return 'WhatsApp';
      case 'phone':
        return 'Телефонный звонок';
      case 'email':
        return 'Email';
      default:
        return 'Не указан';
    }
  };

  const submitToGoogleForms = async () => {
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSepPfrOsTsx8e0veqjDfQ7es8DnP8MpSxY9xJxB_VyQk_z60Q/formResponse";
    
    // Создаем данные для отправки
    const formDataToSend = new FormData();
    
    const fields = {
      'entry.1803102575': formData.name,
      'entry.1496045372': formData.phone,
      'entry.392138171': getContactMethodText(formData.contactMethod),
      'entry.1639246950': calculatorData ? calculatorData.service : "Прямой запрос",
      'entry.749667160': calculatorData ? `${calculatorData.meters} ${calculatorData.service === "Мойка окон" ? "окон" : "м²"}` : "Не указана",
      'entry.1761612622': calculatorData ? `от ${calculatorData.calculatedPrice?.min || 0} до ${calculatorData.calculatedPrice?.max || 0} руб.` : "Не рассчитывалась",
      'entry.1146187820': calculatorData?.comment || "",
      'entry.consent_timestamp': new Date().toISOString(),
      'entry.privacy_consent': consents.privacyPolicyRead ? 'Да' : 'Нет',
      'entry.data_processing_consent': consents.dataProcessing ? 'Да' : 'Нет'
    };

    // Добавляем поля в FormData
    Object.entries(fields).forEach(([name, value]) => {
      formDataToSend.append(name, value);
    });

    try {
      // Отправляем запрос с no-cors, чтобы избежать CORS ошибок
      const response = await fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors', // Важно: используем no-cors чтобы избежать CORS
        body: formDataToSend
      });

      // В режиме no-cors response будет opaque, но запрос отправится
      console.log('✅ Форма отправлена в Google Forms');
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка отправки формы:', error);
      
      // Альтернативный способ через image (работает всегда)
      const fallbackSuccess = submitToGoogleFormsFallback();
      return fallbackSuccess;
    }
  };

  // Fallback метод через создание скрытой iframe
  const submitToGoogleFormsFallback = () => {
    return new Promise((resolve) => {
      // Создаем скрытую iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'google-form-iframe';
      
      // Создаем форму
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = "https://docs.google.com/forms/d/e/1FAIpQLSepPfrOsTsx8e0veqjDfQ7es8DnP8MpSxY9xJxB_VyQk_z60Q/formResponse";
      form.target = 'google-form-iframe'; // Отправляем в iframe
      form.style.display = 'none';

      // Добавляем поля
      const fields = {
        'entry.1803102575': formData.name,
        'entry.1496045372': formData.phone,
        'entry.392138171': getContactMethodText(formData.contactMethod),
        'entry.1639246950': calculatorData ? calculatorData.service : "Прямой запрос",
        'entry.749667160': calculatorData ? `${calculatorData.meters} ${calculatorData.service === "Мойка окон" ? "окон" : "м²"}` : "Не указана",
        'entry.1761612622': calculatorData ? `от ${calculatorData.calculatedPrice?.min || 0} до ${calculatorData.calculatedPrice?.max || 0} руб.` : "Не рассчитывалась",
        'entry.1146187820': calculatorData?.comment || "",
        'entry.consent_timestamp': new Date().toISOString(),
        'entry.privacy_consent': consents.privacyPolicyRead ? 'Да' : 'Нет',
        'entry.data_processing_consent': consents.dataProcessing ? 'Да' : 'Нет'
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      // Добавляем iframe и форму в DOM
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      
      // Отправляем форму
      form.submit();
      
      // Удаляем элементы после отправки
      setTimeout(() => {
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        resolve(true);
      }, 1000);
    });
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newTouched = {
      name: true,
      phone: true,
      contactMethod: true,
      privacyPolicyRead: true,
      dataProcessing: true
    };
    setTouched(newTouched);

    if (!validateForm()) {
      alert("Пожалуйста, исправьте ошибки в форме и дайте все необходимые согласия");
      return;
    }

    // ЛОГИРУЕМ СОГЛАСИЯ ПЕРЕД ОТПРАВКОЙ
    await logConsents();

    // Показываем сообщение о начале отправки
    alert("Отправляем вашу заявку...");

    // Отправляем только в Google Forms
    const success = await submitToGoogleForms();

    if (success) {
      alert("Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.");
      
      // Очищаем данные после отправки
      sessionStorage.removeItem('calculatorData');
      sessionStorage.removeItem('contactsFormData');
      sessionStorage.removeItem('contactsConsents');
      sessionStorage.removeItem('consentLog');
      sessionStorage.removeItem('calculatorFormData');
      hasLoadedCalculatorData.current = false;
      setCalculatorData(null);
      
      setConsents({
        privacyPolicyRead: false,
        dataProcessing: false
      });
      
      setFormData({
        name: "",
        phone: "",
        contactMethod: ""
      });
      
      setTouched({
        name: false,
        phone: false,
        contactMethod: false,
        privacyPolicyRead: false,
        dataProcessing: false
      });
      
      setErrors({
        name: "",
        phone: "",
        contactMethod: "",
        privacyPolicyRead: "",
        dataProcessing: ""
      });
    } else {
      alert("Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.");
    }
  };

  // Проверка валидности формы
  const isFormValid = () => {
    const allFieldsFilled = formData.name && formData.phone && formData.contactMethod;
    const allConsentsGiven = consents.privacyPolicyRead && consents.dataProcessing;
    const noErrors = !errors.name && !errors.phone && !errors.contactMethod && 
                    !errors.privacyPolicyRead && !errors.dataProcessing;
    
    return allFieldsFilled && allConsentsGiven && noErrors;
  };

  // Функция для определения класса поля
  const getFieldClassName = (fieldName) => {
    return touched[fieldName] && errors[fieldName] ? "error" : "";
  };

  // Ссылка на политику конфиденциальности
  const privacyPolicyLink = "#privacy-policy";

  return (
    <section className="contacts" id="contact">
      <div className="container">
        <div className="contacts-container">
          <h2 className="contacts-title">Контакты</h2>

          <div className="contacts-grid">
            {/* Левая колонка */}
            <div className="contacts-info">
              <div className="contacts-item">
                <h3>Наша почта</h3>
                <p>cleaninpark@yandex.ru</p>
              </div>

              <div className="contacts-item">
                <h3>Телефон</h3>
                <a href="tel:+79956623002" 
                  data-desktop-message="Позвонить? Откроется приложение для звонков">
                  <span className="contacts-item-span">+7 (995) 662-30-02</span>
                </a>
              </div>

              <div className="contacts-buttons">
                <a href="https://t.me/+79956623002" className="btn-link telegram">Telegram</a>
                <a href="https://wa.me/+79956623002" className="btn-link whatsapp">WhatsApp</a>
              </div>

              <p className="contacts-note">
                По всем вопросам обращайтесь по телефону или через мессенджеры.
              </p>
            </div>

            {/* Правая колонка — форма */}
            <div className="contacts-form-block">
              <h3>Заказать обратный звонок или сообщение</h3>

              {/* Блок с данными из калькулятора */}
              {calculatorData && (
                <div className="calculator-summary" style={{
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #e9ecef',
                  fontSize: '14px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#28a745' }}>
                    ✅ Данные из калькулятора:
                  </h4>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Услуга:</strong> {calculatorData.service}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>{calculatorData.service === "Мойка окон" ? "Количество окон" : "Площадь"}:</strong> {calculatorData.meters} {calculatorData.service === "Мойка окон" ? "окон" : "м²"}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Примерная стоимость:</strong> от {calculatorData.calculatedPrice?.min?.toLocaleString()} до {calculatorData.calculatedPrice?.max?.toLocaleString()} ₽
                  </p>
                  {calculatorData.comment && (
                    <p style={{ margin: '5px 0' }}>
                      <strong>Комментарий:</strong> {calculatorData.comment}
                    </p>
                  )}
                </div>
              )}

              <form className="contacts-form" onSubmit={handleSubmit} ref={formRef}>
                <div className="form-row">
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Ваше имя" 
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getFieldClassName('name')}
                    />
                    {touched.name && errors.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="phone"
                      placeholder="Номер телефона" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getFieldClassName('phone')}
                    />
                    {touched.phone && errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <select 
                      name="contactMethod"
                      value={formData.contactMethod}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={getFieldClassName('contactMethod')}
                    >
                      <option value="">Предпочтительный способ связи:</option>
                      <option value="telegram">Telegram</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="phone">Телефонный звонок</option>
                    </select>
                    {touched.contactMethod && errors.contactMethod && (
                      <span className="error-message">{errors.contactMethod}</span>
                    )}
                  </div>
                </div>

                {/* ОБНОВЛЕННЫЙ БЛОК СОГЛАСИЙ - ДВА ОТДЕЛЬНЫХ ЧЕКБОКСА */}
                <div className="form-row">
                  <div className="form-group privacy-consents-group" style={{

                    padding: '0px',
                    borderRadius: '8px',

                  }}>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>
                      Необходимые соглашения:
                    </h4>
                    
                    {/* Чекбокс 1 - Ознакомление с политикой */}
                    <label className="checkbox-label" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      marginBottom: '15px'
                    }}>
                      <input
                        type="checkbox"
                        checked={consents.privacyPolicyRead}
                        onChange={(e) => handleConsentChange('privacyPolicyRead', e.target.checked)}
                        onBlur={() => setTouched(prev => ({ ...prev, privacyPolicyRead: true }))}
                        style={{ marginTop: '2px', minWidth: '16px', flex: 1 }}
                      />
                      <span>
                        <strong>Я ознакомлен(а) с </strong>
                        <a 
                          href={privacyPolicyLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#007bff', textDecoration: 'underline', flex: 5 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Политикой в области обработки и защиты персональных данных
                        </a>
                      </span>
                    </label>
                    {touched.privacyPolicyRead && errors.privacyPolicyRead && (
                      <span className="error-message" style={{ display: 'block', marginTop: '5px', color: '#dc3545' }}>
                        {errors.privacyPolicyRead}
                      </span>
                    )}

                    {/* Чекбокс 2 - Согласие на обработку данных */}
                    <label className="checkbox-label" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      marginBottom: '10px'
                    }}>
                      <input
                        type="checkbox"
                        checked={consents.dataProcessing}
                        onChange={(e) => handleConsentChange('dataProcessing', e.target.checked)}
                        onBlur={() => setTouched(prev => ({ ...prev, dataProcessing: true }))}
                        style={{ marginTop: '2px', minWidth: '16px', flex: 1 }}
                      />
                      <span>
                        <strong>Даю согласие на обработку моих персональных данных</strong>
                        <div style={{ fontSize: '0.9em', color: '#666', marginLeft: '0', marginTop: '5px', flex: 5 }}>
                          (ФИО, телефон, параметры объекта) в целях обработки заявки, 
                          заключения и исполнения договора на оказание клининговых услуг. 
                          Срок действия согласия: до исполнения обязательств по договору.
                        </div>
                      </span>
                    </label>
                    {touched.dataProcessing && errors.dataProcessing && (
                      <span className="error-message" style={{ display: 'block', marginTop: '5px', color: '#dc3545' }}>
                        {errors.dataProcessing}
                      </span>
                    )}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn-submit"
                  
                >
                  {calculatorData ? 'Получить точный расчет' : 'Связаться с менеджером'}
                </button>
              </form>
            </div>
          </div>
          <iframe className="map" src="https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=205650411945" frameborder="0"></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contacts;