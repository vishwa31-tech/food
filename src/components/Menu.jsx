import React from 'react';
import FoodCard from './FoodCard';
import { FOOD_ITEMS } from '../data/mockData';

const Menu = ({ onAddToCart }) => (
  <section id="menu" className="explosive-menu-section">
    <div className="explosive-menu-container">
      <div className="explosive-menu-header animate-fade-in delay-3">
        <h2 className="explosive-menu-title">Our Signature Dishes</h2>
        <br />
        <p className="explosive-menu-subtitle">Prepared with love by world-class chefs.</p>
      </div>
      
      <div className="explosive-menu-grid">
        {FOOD_ITEMS.map((item, index) => (
          <div key={item.id} style={{ animationDelay: `${0.1 * index}s`, transform: index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)' }} className="animate-fade-in">
            <FoodCard item={item} onAdd={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Menu;
