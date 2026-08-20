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
    </section>
  );
};

export default TrustBlock;
