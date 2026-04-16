import React from 'react';
import { Star, Plus } from 'lucide-react';

const FoodCard = ({ item, onAdd }) => (
  <div className="explosive-food-card">
    <div className="explosive-card-image-wrapper">
      <img src={item.image} alt={item.name} className="explosive-card-image" loading="lazy" />
    </div>
    <div className="explosive-card-info">
      <div className="explosive-card-header">
        <h3 className="explosive-card-title">{item.name}</h3>
        <span className="explosive-card-price">${item.price.toFixed(2)}</span>
      </div>
      <p className="explosive-card-desc">{item.desc}</p>
      
      <div className="explosive-card-footer">
        <div className="explosive-rating">
          <Star size={16} fill="#ffb703" />
          <span>{item.rating}</span>
        </div>
        <button className="explosive-add-btn" onClick={() => onAdd(item)}>
          <Plus size={24} />
        </button>
      </div>
    </div>
  </div>
);

export default FoodCard;
