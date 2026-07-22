import React, { useState, useEffect } from "react";
import "../style/Calculator.css";
import { publicUrl } from "../utils/publicUrl";

const Calculator = () => {
  const [area, setArea] = useState("");
  const [service, setService] = useState("");
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);

  // Динамические данные из конфига json
  const [configRates, setConfigRates] = useState({});
  const [configNames, setConfigNames] = useState({});
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(publicUrl("services.json"));
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);

        const jsonData = await response.json();

        if (jsonData && jsonData.services) {
          const rates = {};
          const names = {};

          jsonData.services.forEach((item) => {
            rates[item.id] = {
              min: item.priceMin || 100,
              max: item.priceMax || 200,
            };
            names[item.id] = item.title;
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
    const areaNum = parseInt(area, 10);
    if (isNaN(areaNum)) return "Введите число";
    if (areaNum < 1) return serviceType === "windows" ? "Минимум 1 окно" : "Минимум 1 м²";
    return "";
  };

  // Кладёт результат расчёта туда, откуда его подхватит форма на "Контактах",
  // и переводит пользователя к этой форме. Сама калькулятор ничего никуда
  // не отправляет — единственная реальная отправка происходит в Contacts.jsx
  // после того, как пользователь даст согласия и нажмёт "Отправить".
  const handOffToContactForm = (calculatedPrice) => {
    const calculatorData = {
      name,
      phone,
      service: configNames[service] || service,
      meters: area,
      calculatedPrice,
      timestamp: Date.now(),
    };

    try {
      sessionStorage.setItem("calculatorData", JSON.stringify(calculatorData));
    } catch (error) {
      console.error("Не удалось сохранить данные калькулятора:", error);
    }

    // На случай, если Contacts уже смонтирован на этой же странице —
    // событие подхватывается сразу, без ожидания повторного чтения sessionStorage.
    window.dispatchEvent(new CustomEvent("calculatorDataSaved", { detail: calculatorData }));

    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (window.history.pushState) {
      window.history.pushState(null, "", "#contact");
    } else {
      window.location.hash = "contact";
    }
  };

  const handleCalculate = () => {
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

    const areaNum = parseInt(area, 10);
    const rates = configRates[service];
    if (!rates) return;

    const calculatedPrice = { min: areaNum * rates.min, max: areaNum * rates.max };

    setPriceRange(calculatedPrice);
    setIsCalculated(true);

    handOffToContactForm(calculatedPrice);
  };

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
          {errors.phone && <span className="error-message">{errors.phone}</span>}
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
            {Object.keys(configNames).map((key) => (
              <option key={key} value={key}>
                {configNames[key]}
              </option>
            ))}
          </select>
          {errors.service && <span className="error-message">{errors.service}</span>}
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

        <button
          onClick={handleCalculate}
          className="btn2 btn-anim"
          disabled={!name || !phone || !service || !area}
        >
          Рассчитать стоимость
        </button>
      </div>

      {priceRange.min && priceRange.max && isCalculated && (
        <div className="price-result">
          <p>
            <b>Примерная стоимость:</b>
          </p>
          <p className="price-range">
            от {formatPrice(priceRange.min)} до {formatPrice(priceRange.max)} ₽
          </p>
          <p className="calculator-handoff-note">
            Переходим к форме заявки — там нужно будет подтвердить согласия и
            отправить заявку менеджеру.
          </p>
        </div>
      )}
    </section>
  );
};

export default Calculator;
