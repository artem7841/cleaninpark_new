import React from "react";

const ContactsInfo = ({ contacts }) => (
  <div className="contacts-info">
    <div className="contacts-item">
      <h3>Наша почта</h3>
      <p>{contacts.email}</p>
    </div>

    <div className="contacts-item">
      <h3>Телефон</h3>
      <a
        href={`tel:${contacts.phoneTel}`}
        data-desktop-message="Позвонить? Откроется приложение для звонков"
      >
        <span className="contacts-item-span">{contacts.phoneDisplay}</span>
      </a>
    </div>

    <div className="contacts-buttons">
      <a href={contacts.telegramUrl} className="btn-link telegram">
        Telegram
      </a>
      <a href={contacts.whatsappUrl} className="btn-link whatsapp">
        Max
      </a>
    </div>

    <p className="contacts-note">
      По всем вопросам обращайтесь по телефону или через мессенджеры.
    </p>
  </div>
);

export default ContactsInfo;
