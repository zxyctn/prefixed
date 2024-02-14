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
      className={`bg-transparent border-2 border-secondary md:px-6 px-4 justify-between items-center w-min-[300px] h-[70px] md:h-[80px] flex  ${
        vertical ? 'grid gap-6' : ''
      }}`}
    >
      {children ? (
        <div
          className={`justify-center flex pr-4 md:pr-6 ${
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
        className={`bg-transparent p-0 w-full place-self-center uppercase roboto-regular ${className}`}
      />
    </div>
  );
};

export default InputField;
