import React from 'react';

import type { InputFieldProps } from '../types';

const InputField = ({
  children = null,
  vertical = false,
  className = '',
  type = 'text',
  required = false,
  onChange,
}: InputFieldProps) => {
  return (
    <div
      className={`bg-transparent border-2 border-secondary md:p-6 p-4 justify-between w-min-[300px] h-[70px] md:h-[80px] flex gap-6 ${
        vertical ? 'grid gap-6' : ''
      }}`}
    >
      {children ? (
        <div
          className={`m-auto justify-center flex ${
            vertical ? 'w-full' : 'w-min'
          }`}
        >
          {children}
        </div>
      ) : null}

      <input
        type={type}
        onChange={onChange}
        required={required}
        className={`bg-transparent md:text-2xl text-xl uppercase m-auto roboto-regular w-min-[200px] ${className}`}
      />
    </div>
  );
};

export default InputField;
