import React from "react";

const ConsentCheckboxes = ({ consents, errors, touched, onChange, onBlur, privacyPolicyLink }) => (
  <div className="form-group privacy-consents-group">
    <h4 className="privacy-consents-title">Необходимые соглашения:</h4>

    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={consents.privacyPolicyRead}
        onChange={(e) => onChange("privacyPolicyRead", e.target.checked)}
        onBlur={() => onBlur("privacyPolicyRead")}
      />
      <span>
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
        type="checkbox"
        checked={consents.dataProcessing}
        onChange={(e) => onChange("dataProcessing", e.target.checked)}
        onBlur={() => onBlur("dataProcessing")}
      />
      <span>
        <strong>Даю согласие на обработку моих персональных данных</strong>
        <div className="consent-details">
          (ФИО, телефон, параметры объекта) в целях обработки заявки, заключения и
          исполнения договора на оказание клининговых услуг. Срок действия согласия: до
          исполнения обязательств по договору.
        </div>
      </span>
    </label>
    {touched.dataProcessing && errors.dataProcessing && (
      <span className="error-message error-message--block">{errors.dataProcessing}</span>
    )}
  </div>
);

export default ConsentCheckboxes;
