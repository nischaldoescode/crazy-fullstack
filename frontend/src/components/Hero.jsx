import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../assets/assets';
import './Hero.css';

const Hero = () => {
  // Get the first 5 products' main images for the carousel
  const carouselItems = products.slice(0, 5).map(product => ({
    id: product._id,
    image: product.image[0],
    title: product.name,
    subtitle: product.description.substring(0, 80) + '...', // Slightly shorter for left-aligned layout
    ctaText: product.bestseller ? "Shop Now" : "View Details"
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused || carouselItems.length <= 1) return;

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, isPaused, carouselItems.length]);

  // Manual navigation
  const goToSlide = (index) => {
    clearTimeout(timeoutRef.current);
    setCurrentIndex(index);
    // Restart auto-scroll
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % carouselItems.length);
    }, 5000);
  };

  return (
    <div className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carousel-container w-full">

        <div
          className="carousel-track w-full "
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.6s ease-in-out'
          }}
        >
          {carouselItems.map((item, index) => (
            <div key={item.id} className="relative min-w-full">
              <div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-contain w-full"
                  loading="lazy"
                />
              </div>
              <div className={` slide-content ${index === currentIndex ? 'active' : ''}`}>

                <div className="text-container">
                  <h1 className="slide-title text-xl font-semibold">{item.title}</h1>
                  <p className="slide-subtitle text-base">{item.subtitle}</p>
                  <button
                    className="slide-cta"
                    onClick={() => navigate('/collection')} // Add this onClick handler
                  >
                    {item.ctaText}
                  </button>
                </div>

              </div>


            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="carousel-indicators">
        {carouselItems.map((_, index) => (
          <button
            key={`indicator-${index}`}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;


