// src/components/ScrollToTopBadge.jsx
import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback.jsx';

export default function ScrollToTopBadge({
  threshold = 200,
  debounceDelay = 100
}) {
  const [visible, setVisible] = useState(false);

  const handleScroll = useDebouncedCallback(() => {
    setVisible(window.pageYOffset > threshold);
  }, debounceDelay);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div
      className={`
        hidden sm:flex        
        fixed bottom-4 right-4 z-50
        flex-col items-center space-y-1
        transition-opacity duration-300 
        ${visible 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'}
      `}
    >
      <button
        onClick={scrollToTop}
        aria-label="Nach oben scrollen"
        className="
          btn btn-circle btn-outline p-0 flex items-center justify-center
          w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12
        "
      >
        <FiArrowUp className="text-base md:text-lg lg:text-xl" />
      </button>
      {/* Text nur ab md anzeigen */}
      <span className="hidden md:inline text-xs md:text-sm lg:text-base font-medium">
        Scroll to Top
      </span>
    </div>
  );
}
