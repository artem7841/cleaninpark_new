import React from 'react';
import '../style/TrustBlock.css';

import logo1 from '../assets/wild-logo.png';
import logo2 from '../assets/yandex-market-logo.png';
import logo3 from '../assets/ozon-logo.png';

const TrustBlock = () => {
  const partners = [
    { id: 1, src: logo1, alt: 'Партнер 1' },
    { id: 2, src: logo2, alt: 'Партнер 2' },
    { id: 3, src: logo3, alt: 'Партнер 3' },
  ];

  return (
    <section className="trust-section">
      <h2 className="trust-title">Нам доверяют</h2>
      <div className="trust-logos">
        {partners.map((partner) => (
          <div key={partner.id} className="logo-item">
            <img src={partner.src} alt={partner.alt} />
          </div>
        ))}
      </div>
      <div className="trust-complexes">
    <h3 className='complexes-title'>Работаем в жилых комплексах Екатеринбурга:</h3>
    <div className="complexes-list">
      <span>ЖК Светлый</span> <span className="separator">•</span>
      <span>ЖК Клевер Парк</span> <span className="separator">•</span>
      <span>ЖК Солнечный</span> <span className="separator">•</span>
      <span>ЖК Первый Академ</span> <span className="separator">•</span>
      <span>ЖК Преображенский</span> <span className="separator">•</span>
      <span>ЖК Eleven</span> <span className="separator">•</span>
      <span>ЖК Южные кварталы</span> <span className="separator">•</span>
      <span>ЖК Шишимская горка</span> <span className="separator">•</span>
      <span>ЖК Московский квартал</span> <span className="separator">•</span>
      <span>ЖК Макаровский</span> <span className="separator">•</span>
      <span>ЖК Парк Столиц</span> <span className="separator">•</span>
      <span>ЖК Исеть Парк</span> <span className="separator">и других.</span>
    </div>
  </div>
    </section>
  );
};

export default TrustBlock;
