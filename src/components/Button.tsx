import React from 'react';

import Separated from './Separated';
import type { ButtonProps } from '../types';

const Button = ({
  className,
  children,
  onClick,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      className={`btn roboto-medium uppercase text-lg p-8 h-[70px] md:h-[80px] items-center content-center ${className}`}
      onClick={onClick}
      type={type}
    >
      <Separated content={children} className='separated-min md:separated' />
    </button>
  );
};

export default Button;
