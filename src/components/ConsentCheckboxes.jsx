import React from "react";
const ConsentCheckboxes = ({ consents, errors, touched, onChange, onBlur, privacyPolicyLink }) => (
  <div className="form-group privacy-consents-group">
    <h4 className="privacy-consents-title">Необходимые соглашения:</h4>

    {/* Первый чекбокс */}
    <label className="checkbox-label">
      <input
        className="checkbox-input checkbox-convention" // Добавили класс checkbox-input
        type="checkbox"
        checked={consents.privacyPolicyRead}
        onChange={(e) => onChange("privacyPolicyRead", e.target.checked)}
        onBlur={() => onBlur("privacyPolicyRead")}
      />
      <span className="checkmark"></span> {/* Добавили спан для кастомной галочки */}
      <span className="checkbox-text"> {/* Обернули текст для правильного выравнивания */}
        <strong>Я ознакомлен(а) с </strong>
        <a
          href={privacyPolicyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="privacy-policy-link"
          onClick={(e) => e.stopPropagation()}
        >
          Политикой в области обработки и защиты персональных данных
        </a>
      </span>
    </label>
    {touched.privacyPolicyRead && errors.privacyPolicyRead && (
      <span className="error-message error-message--block">{errors.privacyPolicyRead}</span>
    )}


    <label className="checkbox-label">
      <input
        className="checkbox-input" 
        type="checkbox"
        checked={consents.dataProcessing}
        onChange={(e) => onChange("dataProcessing", e.target.checked)}
        onBlur={() => onBlur("dataProcessing")}
      />
      <span className="checkmark"></span> 
      <span className="checkbox-text"> 
        <strong>Даю согласие на обработку моих персональных данных</strong>
        <span className="consent-text-sub">
          (ФИО, телефон, параметры объекта) в целях обработки заявки, заключения и
          исполнения договора на оказание клининговых услуг. Срок действия согласия: до
          исполнения обязательств по договору.
        </span>
      </span>
    </label>
    {touched.dataProcessing && errors.dataProcessing && (
      <span className="error-message error-message--block">{errors.dataProcessing}</span>
    )}
  </div>
);

export default ConsentCheckboxes;
