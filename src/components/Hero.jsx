import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => (
  <section className="explosive-hero-section">
    <div className="explosive-hero-bg-glow"></div>
    <div className="explosive-hero-grid">
      
      {/* Left Content Area */}
      <div className="explosive-hero-content">
        <div className="explosive-badge">
          <span className="explosive-badge-icon">🔥</span>
          <span className="explosive-badge-text">#1 Food Delivery App</span>
        </div>
        
        <h1 className="explosive-title">
          Experience the <span className="explosive-highlight ">Magic</span> of Fine Dining at Home.
        </h1>
        
        <p className="explosive-subtitle">
          From local favorites to gourmet meals, get your cravings delivered hot and fresh in under 30 minutes. Let's feast!
        </p>
        
        <div className="explosive-ctas">
          <a href="#menu" className="explosive-btn-primary" style={{ textDecoration: 'none' }}>
            Order Now <ArrowRight size={20} strokeWidth={3} />
          </a>
          <a href="#about" className="explosive-btn-secondary" style={{ textDecoration: 'none' }}>
            <PlayCircle size={20} strokeWidth={3} /> 
            <span>How it works</span>
          </a>
        </div>
      </div>
      
      {/* Right Image Area */}
      <div className="explosive-hero-visuals">
        <div className="explosive-hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
            alt="Delicious spread of food" 
            className="explosive-hero-image"
          />
          {/* Dynamic Floating Element */}
          <div className="explosive-floating-card">
            <div className="explosive-pulse-dot"></div>
            <div>
              <p className="explosive-float-title">Hot & Fresh</p>
              <p className="explosive-float-sub">Delivering right now</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </section>
);

export default Hero;
