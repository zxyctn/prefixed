import React from 'react';

const Button = ({ className, children, onClick }: ButtonProps) => {
  return (
    <button
      className={`btn roboto-regular separated uppercase text-2xl p-8 items-center content-center ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
