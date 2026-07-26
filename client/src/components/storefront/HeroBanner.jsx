import { useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
const slides = [
  {
    image: '/assets/banners/hero-farmland.png',
    title: "Fresh from Sri Lanka's Farms",
    subtitle: 'Direct-to-consumer. Zero waste. JIT delivery.',
    btnText: 'Shop Now',
    btnLink: '/',
  },
  {
    image: '/assets/banners/hero-produce.png',
    title: 'Peak Season Deals',
    subtitle: 'Dambulla Big Onions at harvest price. Order in advance.',
    btnText: 'Pre-Order Now',
    btnLink: '/',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-banner">
      <div className="hero-banner-viewport">
        {slides.map((slide, idx) => (
          <div key={idx} className={`hero-slide ${idx !== current ? 'inactive' : ''}`}>
            <img src={slide.image} alt={slide.title} className="hero-image" />
            <div className="hero-overlay" />
            <div className="hero-content">
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <Link to={slide.btnLink} className="btn btn-primary hero-btn">
                {slide.btnText}
              </Link>
            </div>
          </div>
        ))}

        <div className="hero-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`hero-dot ${idx === current ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
