import React from 'react';

const CommonCard = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        bg-white/80 backdrop-blur-lg 
        rounded-2xl shadow-2xl 
        border border-white/20
        p-8 md:p-10
        animate-slide-up
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default CommonCard;
