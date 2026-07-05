import React, { useState, useEffect } from "react";
import { publicUrl } from "../utils/publicUrl";

const Calculator = () => {
  const [area, setArea] = useState("");
  const [service, setService] = useState("");
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Динамические данные из конфига json
  const [configRates, setConfigRates] = useState({});
  const [configNames, setConfigNames] = useState({});
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Загружаем конфиг при монтировании
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(publicUrl("services.json"));
        if (!response.ok)
          throw new Error(`Ошибка загрузки: ${response.status}`);

        const jsonData = await response.json();

        if (jsonData && jsonData.services) {
          const rates = {};
          const names = {};

          // Парсим массив из json в объекты для калькулятора
          jsonData.services.forEach((item) => {
            // Берем id из json (например: "general", "repair" и т.д.)
            rates[item.id] = {
              min: item.priceMin || 100, // Если в json нет priceMin, будет 100 по дефолту
              max: item.priceMax || 200,
            };
            names[item.id] = item.title; // Подтягиваем человеческое название
          });

          setConfigRates(rates);
          setConfigNames(names);
        }
      } catch (err) {
        console.error("Не удалось загрузить конфиг для калькулятора:", err);
      } finally {
        setLoadingConfig(false);
      }
    };

    loadConfig();
  }, []);

  // Валидация
  const validateName = (name) => {
    if (!name.trim()) return "Введите имя";
    if (name.trim().length < 2) return "Имя должно содержать минимум 2 символа";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Введите телефон";
    const cleanPhone = phone.replace(/[^\d]/g, "");
    if (cleanPhone.length < 10)
      return "Телефон должен содержать минимум 10 цифр";
    return "";
  };

  const validateService = (service) => {
    if (!service) return "Выберите тип услуги";
    return "";
  };

  const validateArea = (area, serviceType) => {
    if (!area.trim()) {
      return serviceType === "windows"
        ? "Введите количество окон"
        : "Введите площадь";
    }
    const areaNum = parseInt(area);
    if (isNaN(areaNum)) return "Введите число";
    if (areaNum < 1)
      return serviceType === "windows" ? "Минимум 1 окно" : "Минимум 1 м²";
    return "";
  };

  // Функция отправки в Google Forms
  const submitToGoogleForms = async (calculatedPrice) => {
    setIsSubmitting(true);

    const googleFormUrl = "https://google.com";

    const formData = new FormData();

    formData.append("entry.1803102575", name);
    formData.append("entry.1496045372", phone);
    formData.append("entry.1639246950", configNames[service] || service); // Имя из конфига
    formData.append(
      "entry.749667160",
      `${area} ${service === "windows" ? "окон" : "м²"}`,
    );
    formData.append(
      "entry.1761612622",
      `от ${calculatedPrice.min || 0} до ${calculatedPrice.max || 0} руб.`,
    );
    formData.append("entry.consent", consent ? "Да" : "Нет");
    formData.append("entry.timestamp", new Date().toISOString());

    try {
      await fetch(googleFormUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
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
      area: validateArea(area, service),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      setIsCalculated(false);
      return;
    }

    const areaNum = parseInt(area);
    const rates = configRates[service]; // Берем цены из загруженного конфига

    if (rates) {
      const minPrice = areaNum * rates.min;
      const maxPrice = areaNum * rates.max;
      const calculatedPrice = { min: minPrice, max: maxPrice };

      setPriceRange(calculatedPrice);
      setIsCalculated(true);
      setSubmissionSuccess(false);

      if (consent) {
        submitToGoogleForms(calculatedPrice);
      }
    }
  };

  // Сбрасываем успешную отправку при изменении данных ввода
  useEffect(() => {
    if (name || phone || service || area) {
      setSubmissionSuccess(false);
    }
  }, [name, phone, service, area]);

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0";
  };

  const getAreaPlaceholder = () => {
    return service === "windows" ? "Количество окон" : "Площадь (м²)";
  };

  if (loadingConfig) {
    return (
      <section className="calculator">
        <p style={{ textAlign: "center" }}>Загрузка калькулятора...</p>
      </section>
    );
  }

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
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <select
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setIsCalculated(false);
            }}
            className={errors.service ? "error" : ""}
          >
            <option value="" disabled>
              Тип услуги
            </option>
            {/* Опции генерируются автоматически на основе ключей из конфига */}
            {Object.keys(configNames).map((key) => (
              <option key={key} value={key}>
                {configNames[key]}
              </option>
            ))}
          </select>
          {errors.service && (
            <span className="error-message">{errors.service}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            value={area}
            onChange={(e) => {
              setArea(e.target.value.replace(/[^\d]/g, ""));
              setIsCalculated(false);
            }}
            placeholder={getAreaPlaceholder()}
            className={errors.area ? "error" : ""}
            disabled={!service}
          />
          {errors.area && <span className="error-message">{errors.area}</span>}
        </div>

        {/* Галочка согласия */}
        <div className="consent-checkbox" style={{ margin: "15px 0" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span style={{ fontSize: "14px", color: "#666" }}>
              Даю согласие на обработку персональных данных для расчета
              стоимости <br />
            </span>
          </label>
        </div>

        <button
          onClick={handleCalculateAndSubmit}
          className="btn2 btn-anim"
          disabled={!name || !phone || !service || !area || isSubmitting}
          style={{
            backgroundColor: isSubmitting ? "#ccc" : "",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Отправка..." : "Рассчитать стоимость"}
        </button>

        {!consent && isCalculated && (
          <p
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            Поставьте галочку, чтобы данные автоматически отправились менеджеру
          </p>
        )}
      </div>

      {/* Результат расчета */}
      {priceRange.min && priceRange.max && isCalculated && (
        <div className="price-result">
          <p>
            <b>Примерная стоимость:</b>
          </p>
          <p className="price-range">
            от {formatPrice(priceRange.min)} до {formatPrice(priceRange.max)} ₽
          </p>

          {submissionSuccess ? (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#d4edda",
                color: "#155724",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <p style={{ fontWeight: "bold", margin: 0 }}>
                ✅ Данные успешно отправлены!
              </p>
              <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                Мы свяжемся с вами для уточнения деталей
              </p>
            </div>
          ) : consent ? (
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              Данные отправлены менеджеру. Ожидайте звонка!
            </p>
          ) : (
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              Для отправки данных менеджеру поставьте галочку выше
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default Calculator;
