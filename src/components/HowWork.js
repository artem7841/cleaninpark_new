import React from "react";
import "../style/HowWork.css";

const HowWork = () => {
  const steps = [
    { id: 1, text: "Заявка и расчёт стоимости" },
    { id: 2, text: "Осмотр объекта и заключение договора" },
    { id: 3, text: "Выполнение работ" },
    { id: 4, text: "Приём работы" },
  ];

  return (
    <section className="howwork">
      <div className="howwork-container">
        <h2 className="howwork-title">Как мы работаем</h2>

        <ul className="howwork-list">
          {steps.map((step) => (
            <li key={step.id} className="howwork-item">
              <span className="howwork-number">{step.id}</span>
              <p>{step.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HowWork;
