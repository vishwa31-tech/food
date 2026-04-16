import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import axios from 'axios';

const CartDrawer = ({ isOpen, onClose, cart, clearCart }) => {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    try {
      const data = {
        items: cart,
        totalAmount: total
      };
      const response = await axios.post('http://localhost:5000/api/orders', data);

      if (response.status === 200 || response.status === 201) {
        alert("Success: Your delicious order has been sent to the backend database! 🎉");
        clearCart();
        onClose();
      } else {
        alert("Failed to submit order. Please check the backend.");
      }
    } catch (err) {
      console.error(err);
      alert("Error hitting backend: Make sure your new Node Express server is running on port 5000!");
    }
  };

  return (
    <div className="explosive-cart-overlay" onClick={onClose}>
      <div className="explosive-cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="explosive-cart-header">
          <h2><ShoppingCart size={28} strokeWidth={3} /> Your Cart</h2>
          <button className="explosive-close-btn" onClick={onClose}><X size={24} strokeWidth={3} /></button>
        </div>

        <div className="explosive-cart-body">
          {cart.length === 0 ? (
            <div className="explosive-cart-empty">Your cart is empty. Add some food!</div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="explosive-cart-item">
                <div className="explosive-cart-item-info">
                  <h4>{item.name}</h4>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="explosive-cart-footer">
            <div className="explosive-cart-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="explosive-checkout-btn" onClick={() => handleCheckout()}>
              Place Order securely
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
