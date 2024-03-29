import React from 'react';

import type { InputFieldProps } from '../types';

const InputField = ({
  children = null,
  vertical = false,
  className = '',
  type = 'text',
  required = false,
  min = 0,
  max = 0,
  onChange,
  onKeyDown,
  value,
  options = [],
}: InputFieldProps) => {
  return (
    <div
      className={`bg-transparent border-2 border-secondary md:px-6 px-4 justify-between items-center w-min-[300px] h-[70px] md:h-[80px] ${
        vertical ? 'grid' : 'flex gap-4'
      }`}
    >
      {children ? (
        <div className={`justify-center flex ${vertical ? 'w-full' : 'w-min'}`}>
          {children}
        </div>
      ) : null}

      {type !== 'select' ? (
        <input
          type={type}
          onChange={onChange}
          onKeyDown={onKeyDown}
          required={required}
          value={value}
          min={min}
          max={max}
          className={`bg-transparent p-0 w-full place-self-center uppercase roboto-regular ${className}`}
        />
      ) : (
        <select
          className='bg-transparent uppercase flex w-min justify-center items-center'
          onChange={onChange}
        >
          {options.map((o) => (
            <option value={o.value} key={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default InputField;
