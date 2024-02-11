import React, { ReactNode } from 'react';

const InputField = ({
  children = null,
  vertical = false,
  className = '',
}: {
  children?: ReactNode;
  vertical?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`bg-transparent border-2 border-secondary p-6 justify-between flex gap-6 ${
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
        type='text'
        className={`bg-transparent text-2xl separated uppercase m-auto roboto-regular max-w-[200px] ${className}`}
      />
    </div>
  );
};

export default InputField;
