import React from 'react';

const Button = ({ className, children }) => {
  return (
    <div
      className={`btn roboto-regular separated uppercase text-2xl p-8 items-center content-center ${className}`}
    >
      {...children}
    </div>
  );
};

export default Button;
