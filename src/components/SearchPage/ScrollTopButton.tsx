import React, { useState, useEffect } from 'react';
import UpIcon from '../../assets/arrow-up.svg';

const ScrollTopButton: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (scrollY < 300) return null;

  return (
    <button
      type="button"
      onClick={handleScrollTop}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-1 py-1 rounded-full bg-[#F78937] shadow-md text-sm"
    >
      <img src={UpIcon} alt="up" />
    </button>
  );
};

export default ScrollTopButton;
