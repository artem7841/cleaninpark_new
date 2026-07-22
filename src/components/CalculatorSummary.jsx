import React from "react";

const CalculatorSummary = ({ calculatorData }) => (
  <div className="calculator-summary">
    <h4 className="calculator-summary-title">✅ Данные из калькулятора:</h4>

    <p className="calculator-summary-row">
      <strong>Услуга:</strong> {calculatorData.service}
    </p>

    <p className="calculator-summary-row">
      <strong>
        {calculatorData.service === "Мойка окон" ? "Количество окон" : "Площадь"}:
      </strong>{" "}
      {calculatorData.meters} {calculatorData.service === "Мойка окон" ? "окон" : "м²"}
    </p>

    <p className="calculator-summary-row">
      <strong>Примерная стоимость:</strong> от{" "}
      {calculatorData.calculatedPrice?.min?.toLocaleString()} до{" "}
      {calculatorData.calculatedPrice?.max?.toLocaleString()} ₽
    </p>

    {calculatorData.comment && (
      <p className="calculator-summary-row">
        <strong>Комментарий:</strong> {calculatorData.comment}
      </p>
    )}
  </div>
);

export default CalculatorSummary;
