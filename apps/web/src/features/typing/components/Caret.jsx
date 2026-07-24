import React from 'react';

export const Caret = ({ top, left, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute bg-teal-400 w-1 h-8 rounded-full transition-all duration-75 ease-out animate-pulse"
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    />
  );
};