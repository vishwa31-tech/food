import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CartDrawer from './components/CartDrawer';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="app-container">
      <Header cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        clearCart={() => setCart([])} 
      />

      <main>
        <Hero />
        <Menu onAddToCart={handleAddToCart} />
        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
