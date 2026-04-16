import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Header = ({ cartCount, onCartClick }) => (
  <header className="explosive-header-wrapper">
    <div className="explosive-header-container">
      
      {/* BRAND: Kinetic & Bold */}
      <div className="explosive-brand group">
        <div className="explosive-logo-box">
          <div className="explosive-logo-bg" />
          <span className="explosive-logo-letter">H</span>
        </div>
        <span className="explosive-brand-text font-gray-100">
          Hot Spicy<span className="explosive-brand-dot"></span>
        </span>
      </div>
      
      {/* NAV: Floating Pill Style */}
      <nav className="explosive-nav">
        {['Menu', 'About', 'Contact'].map((item) => (
          <a 
            key={item}
            href={`#${item.toLowerCase()}`} 
            className="explosive-nav-item"
          >
            {item === 'About' ? 'About Us' : item}
          </a>
        ))}
      </nav>

      {/* ACTIONS: High-Contrast Interaction */}
      <div className="explosive-actions">
        <button 
          className="explosive-cart-btn group"
          onClick={onCartClick}
        >
          <ShoppingCart size={22} strokeWidth={3} />
          {cartCount > 0 && (
            <span className="explosive-cart-badge">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </header>
);

export default Header;