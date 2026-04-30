import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleAddToCart = (item) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...currentCart, { ...item, quantity: 1, message: "" }];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId, nextQuantity) => {
    setCart((currentCart) => {
      if (nextQuantity < 1) {
        return currentCart.filter((item) => item.id !== itemId);
      }

      return currentCart.map((item) =>
        item.id === itemId ? { ...item, quantity: nextQuantity } : item
      );
    });
  };

  const handleUpdateMessage = (itemId, message) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === itemId ? { ...item, message } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  };

  return (
    <div className="app-container">
      <Header cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
      {isCheckoutOpen ? (
        <Checkout 
          cart={cart} 
          onClose={() => {
            setIsCheckoutOpen(false);
            setCart([]);
          }} 
        />
      ) : (
        <>
          <CartDrawer 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cart={cart} 
            clearCart={() => setCart([])}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdateMessage={handleUpdateMessage}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />

          <main>
            <Hero />
            <Menu onAddToCart={handleAddToCart} />
            <About />
            <Contact />
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}
