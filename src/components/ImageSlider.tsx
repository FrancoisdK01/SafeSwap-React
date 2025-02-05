import React, { useState, useEffect } from 'react';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4',
    alt: 'Pay Safe and Seamlessly',
    title: 'Pay Safe and Seamlessly'
  },
  {
    src: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d',
    alt: 'Avoid Scammers',
    title: 'Avoid Scammers'
  },
  {
    src: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f',
    alt: 'Sell Clothing',
    title: 'Sell Clothing'
  },
  {
    src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    alt: 'Sell Technology',
    title: 'Sell Technology'
  },
  {
    src: 'https://images.unsplash.com/photo-1580910051074-3eb694886505',
    alt: 'In the click of a button',
    title: 'In the click of a button'
  }
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden bg-gray-100 mb-6">
      {images.map((image, index) => (
        <div
          key={image.src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-2xl font-semibold text-center px-6">
              {image.title}
            </h3>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}