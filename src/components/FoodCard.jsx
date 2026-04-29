import React, { useState, useEffect } from 'react';
import { Star, Plus } from 'lucide-react';

const FoodCard = ({ item, onAdd }) => {
  const [customerRating, setCustomerRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Load customer rating from localStorage on component mount
  useEffect(() => {
    const savedRating = localStorage.getItem(`rating-${item.id}`);
    if (savedRating) {
      setCustomerRating(parseInt(savedRating));
    }
  }, [item.id]);

  // Save customer rating to localStorage
  const handleRatingClick = (rating) => {
    setCustomerRating(rating);
    localStorage.setItem(`rating-${item.id}`, rating.toString());
  };

  // Calculate display rating (customer rating takes precedence if set)
  const displayRating = customerRating > 0 ? customerRating : item.rating;
  const filledStars = Math.round(displayRating);

  return (
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
            <div className="explosive-rating-stars">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={16}
                  fill={(hoverRating > 0 ? index < hoverRating : index < filledStars) ? '#ffb703' : 'none'}
                  color={(hoverRating > 0 ? index < hoverRating : index < filledStars) ? '#ffb703' : '#cbd5e1'}
                  strokeWidth={2}
                  className="explosive-rating-star"
                  onMouseEnter={() => setHoverRating(index + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingClick(index + 1)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <span>{displayRating.toFixed(1)}</span>
            {customerRating > 0 && (
              <span className="explosive-customer-rating">★</span>
            )}
          </div>
          <button className="explosive-add-btn" onClick={() => onAdd(item)}>
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
