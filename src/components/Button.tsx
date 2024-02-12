import React from 'react';

import type { ButtonProps } from '../types';

const Button = ({
  className,
  children,
  onClick,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      className={`btn roboto-medium separated-min md:separated uppercase text-2xl p-8 h-[70px] md:h-[80px] items-center content-center ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
