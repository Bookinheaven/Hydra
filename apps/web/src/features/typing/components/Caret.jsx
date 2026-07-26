import React from 'react';

export const Caret = ({ top, left, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute w-[2.5px] rounded-full bg-[var(--main-color)] animate-caret z-10"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        height: '28px',
        transition: 'top 0.08s ease-out, left 0.08s ease-out',
      }}
    />
  );
};