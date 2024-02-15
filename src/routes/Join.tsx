import React from 'react';
import InputField from '../components/InputField';
import { Key } from 'react-feather';
import Button from '../components/Button';

const Join = () => {
  return (
    <div className='w-full h-full grid place-items-center place-content-center gap-3 md:gap-6'>
      <InputField>
        <Key />
      </InputField>
      <Button className='btn-primary w-full'>Join</Button>
    </div>
  );
};

export default Join;
