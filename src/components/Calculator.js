import React, { useState, useEffect } from "react";

const Calculator = () => {
  const [area, setArea] = useState("");
  const [service, setService] = useState("");
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [consent, setConsent] = useState(false); // Галочка согласия
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Цены за м² для каждого типа услуги
  const priceRates = {
    general: { min: 160, max: 180 },
    support: { min: 110, max: 130 },
    repair: { min: 180, max: 200 },
    office: { min: 30, max: 120 },
    windows: { min: 500, max: 700 },
    other: { min: 500, max: 1000 }
  };

  // Названия услуг для отображения
  const serviceNames = {
    general: "Генеральная уборка",
    support: "Поддерживающая уборка", 
    repair: "Уборка после ремонта",
    office: "Уборка офисов",
    windows: "Мойка окон",
    other: "Другое"
  };

  // Валидация
  const validateName = (name) => {
    if (!name.trim()) return "Введите имя";
    if (name.trim().length < 2) return "Имя должно содержать минимум 2 символа";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Введите телефон";
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10) return "Телефон должен содержать минимум 10 цифр";
    return "";
  };

  const validateService = (service) => {
    if (!service) return "Выберите тип услуги";
    return "";
  };

  const validateArea = (area, serviceType) => {
    if (!area.trim()) {
      return serviceType === "windows" ? "Введите количество окон" : "Введите площадь";
    }
    const areaNum = parseInt(area);
    if (isNaN(areaNum)) return serviceType === "windows" ? "Введите число" : "Введите число";
    if (areaNum < 1) return serviceType === "windows" ? "Минимум 1 окно" : "Минимум 1 м²";
    return "";
  };

  // Функция отправки в Google Forms
  const submitToGoogleForms = async (calculatedPrice) => {
    setIsSubmitting(true);
    
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSepPfrOsTsx8e0veqjDfQ7es8DnP8MpSxY9xJxB_VyQk_z60Q/formResponse";
    
    const formData = new FormData();
    
    // ID полей Google Forms (нужно заменить на ваши)
    formData.append('entry.1803102575', name); // Имя
    formData.append('entry.1496045372', phone); // Телефон
    formData.append('entry.1639246950', serviceNames[service] || service); // Услуга
    formData.append('entry.749667160', `${area} ${service === "windows" ? "окон" : "м²"}`); // Площадь/окна
    formData.append('entry.1761612622', `от ${calculatedPrice.min || 0} до ${calculatedPrice.max || 0} руб.`); // Стоимость
    formData.append('entry.consent', consent ? 'Да' : 'Нет'); // Согласие
    formData.append('entry.timestamp', new Date().toISOString());

    try {
      await fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      setSubmissionSuccess(true);
      console.log("✅ Данные отправлены в Google Forms");
      
    } catch (error) {
      console.error("Ошибка отправки:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Основная функция расчета стоимости
  const handleCalculateAndSubmit = () => {
    const newErrors = {
      name: validateName(name),
      phone: validatePhone(phone),
      service: validateService(service),
      area: validateArea(area, service)
    };

    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error !== "")) {
      setIsCalculated(false);
      return;
    }

    const areaNum = parseInt(area);
    const rates = priceRates[service];
    
    if (rates) {
      const minPrice = areaNum * rates.min;
      const maxPrice = areaNum * rates.max;
      const calculatedPrice = { min: minPrice, max: maxPrice };
      
      setPriceRange(calculatedPrice);
      setIsCalculated(true);
      setSubmissionSuccess(false);
      
      // Автоматически отправляем данные, если есть согласие
      if (consent) {
        submitToGoogleForms(calculatedPrice);
      }
    }
  };

  // Сбрасываем успешную отправку при изменении данных
  useEffect(() => {
    if (name || phone || service || area || consent) {
      setSubmissionSuccess(false);
    }
  }, [name, phone, service, area, consent]);

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0";
  };

  const getAreaPlaceholder = () => {
    return service === "windows" ? "Количество окон" : "Площадь (м²)";
  };

  return (
    <section className="calculator" id="calculator">
      <h2>Рассчитайте стоимость вашей уборки с помощью калькулятора</h2>
      
      <div className="calc-form">
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Имя" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input 
            type="text" 
            placeholder="Телефон" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? "error" : ""}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <select 
            value={service} 
            onChange={(e) => setService(e.target.value)}
            className={errors.service ? "error" : ""}
          >
            <option value="" disabled>Тип услуги</option>
            <option value="general">Генеральная уборка</option>
            <option value="repair">После ремонта</option>
            <option value="support">Поддерживающая</option>
            <option value="office">Для офисов</option>
            <option value="windows">Мойка окон</option>
            <option value="other">Другое</option>
          </select>
          {errors.service && <span className="error-message">{errors.service}</span>}
        </div>

        <div className="form-group">
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value.replace(/[^\d]/g, ''))}
            placeholder={getAreaPlaceholder()}
            className={errors.area ? "error" : ""}
          />
          {errors.area && <span className="error-message">{errors.area}</span>}
        </div>

        {/* Галочка согласия */}
        <div className="consent-checkbox" style={{ margin: "15px 0" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span style={{ fontSize: "14px", color: "#666" }}>
              Даю согласие на обработку персональных данных для расчета стоимости <br/>
              
            </span>
          </label>
        </div>

        <button 
          onClick={handleCalculateAndSubmit} 
          className="btn2 btn-anim"
          disabled={!name || !phone || !service || !area || isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : '',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? "Отправка..." : "Рассчитать стоимость"}
        </button>

        {!consent && isCalculated && (
          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px", textAlign: "center" }}>
            Поставьте галочку, чтобы данные автоматически отправились менеджеру
          </p>
        )}
      </div>

      {/* Результат расчета */}
      {priceRange.min && priceRange.max && isCalculated && (
        <div className="price-result">
          <p><b>Примерная стоимость:</b></p>
          <p className="price-range">
            от {formatPrice(priceRange.min)} до {formatPrice(priceRange.max)} ₽
          </p>
          
          {submissionSuccess ? (
            <div style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: "5px",
              textAlign: "center"
            }}>
              <p style={{ fontWeight: "bold", margin: 0 }}>
                ✅ Данные успешно отправлены!
              </p>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                Мы свяжемся с вами для уточнения деталей
              </p>
            </div>
          ) : consent ? (
            <p style={{ fontSize: "14px", color: "#666", marginTop: "10px", textAlign: "center" }}>
              Данные отправлены менеджеру. Ожидайте звонка!
            </p>
          ) : (
            <p style={{ fontSize: "14px", color: "#666", marginTop: "10px", textAlign: "center" }}>
              Для отправки данных менеджеру поставьте галочку выше
            </p>
          )}
          

        </div>
      )}
    </section>
  );
};

export default Calculator;