import React, { useRef } from "react";
import "../style/Contacts.css";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useCalculatorData } from "../hooks/useCalculatorData";
import { useContactForm } from "../hooks/useContactForm";
import { submitLead, logConsent } from "../utils/submitLead";
import ContactsInfo from "./ContactsInfo";
import CalculatorSummary from "./CalculatorSummary";
import ConsentCheckboxes from "./ConsentCheckboxes";

const PRIVACY_POLICY_LINK = "#privacy-policy";

const Contacts = () => {
  const { config } = useSiteConfig();
  const { contacts, map } = config;
  const formRef = useRef(null);

  const form = useContactForm();
  const { calculatorData, clearCalculatorData } = useCalculatorData({
    onApply: form.applyCalculatorData,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.validateAll()) {
      alert("Пожалуйста, исправьте ошибки в форме и дайте все необходимые согласия");
      return;
    }

    logConsent({ formData: form.formData, consents: form.consents, calculatorData });

    const success = await submitLead({
      formData: form.formData,
      consents: form.consents,
      calculatorData,
    });

    if (success) {
      alert("Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.");
      form.reset();
      clearCalculatorData();
      sessionStorage.removeItem("consentLog");
    } else {
      alert(
        "Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.",
      );
    }
  };

  return (
    <section className="contacts" id="contact">
      <div className="container">
        <div className="contacts-container">
          <h2 className="contacts-title">Контакты</h2>

          <div className="contacts-grid">
            <ContactsInfo contacts={contacts} />

            <div className="contacts-form-block">
              <h3>Заказать обратный звонок или сообщение</h3>

              {calculatorData && <CalculatorSummary calculatorData={calculatorData} />}

              <form className="contacts-form" onSubmit={handleSubmit} ref={formRef}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Ваше имя"
                      value={form.formData.name}
                      onChange={form.handleInputChange}
                      onBlur={form.handleBlur}
                      className={form.getFieldClassName("name")}
                    />
                    {form.touched.name && form.errors.name && (
                      <span className="error-message">{form.errors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Номер телефона"
                      value={form.formData.phone}
                      onChange={form.handleInputChange}
                      onBlur={form.handleBlur}
                      className={form.getFieldClassName("phone")}
                    />
                    {form.touched.phone && form.errors.phone && (
                      <span className="error-message">{form.errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <select
                      name="contactMethod"
                      value={form.formData.contactMethod}
                      onChange={form.handleInputChange}
                      onBlur={form.handleBlur}
                      className={form.getFieldClassName("contactMethod")}
                    >
                      <option value="">Предпочтительный способ связи:</option>
                      <option value="telegram">Telegram</option>
                      <option value="max">Max</option>
                      <option value="phone">Телефонный звонок</option>
                    </select>
                    {form.touched.contactMethod && form.errors.contactMethod && (
                      <span className="error-message">{form.errors.contactMethod}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <ConsentCheckboxes
                    consents={form.consents}
                    errors={form.errors}
                    touched={form.touched}
                    onChange={form.handleConsentChange}
                    onBlur={form.handleConsentBlur}
                    privacyPolicyLink={PRIVACY_POLICY_LINK}
                  />
                </div>

                <button type="submit" className="btn-submit">
                  {calculatorData ? "Получить точный расчет" : "Связаться с менеджером"}
                </button>
              </form>
            </div>
          </div>

          <iframe className="map" src={map.yandexWidgetUrl} title="Карта" frameBorder="0"></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
