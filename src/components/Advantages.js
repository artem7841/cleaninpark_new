import React from "react";
import "../style/Advantages.css";

const Advantages = () => {
  const items = [
    {
      icon: "⭐",
      title: "8000+ уборок",
      text: "Огромный багаж выполненных заказов и довольных клиентов по всему городу."
    },
    {
      icon: "👥",
      title: "Своя школа обучения",
      text: "Собственная система обучения сотрудников. Никаких случайных людей с улицы."
    },
    {
      icon: "🛡️",
      title: "Контроль качества",
      text: "Единые строгие стандарты качества и обязательный контроль каждой уборки."
    },
    {
      icon: "🌿",
      title: "Эко-средства",
      text: "Безопасные профессиональные средства, безвредные для детей и домашних животных."
    },
    {
      icon: "📅",
      title: "Работаем с 2020 года",
      text: "Стабильная клининговая компания с проверенной годами репутацией."
    },
    {
      icon: "🤝",
      title: "Сервис для людей",
      text: "Клиентоориентированный подход и персональные решения под любые ваши задачи."
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="advantages" className="advantages">
      <div className="container">
        <h2 className="advantages-title">Почему выбирают нас</h2>

        <div className="advantages-grid">
          {items.map((advantage) => (
            <div key={advantage.title} className="advantage-card">
              <div className="advantage-icon-wrapper">
                <span>{advantage.icon}</span>
              </div>
              <h3 className="advantage-card-title">{advantage.title}</h3>
              <p className="advantage-card-text">{advantage.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollToSection("contact")}
          className="btn btn-anim"
        >
          Заказать идеальную уборку
        </button>
      </div>
    </section>
  );
};

export default Advantages;
