import React from 'react';

import Button from './components/Button';
import InputField from './components/InputField';
import { Globe, Hash } from 'react-feather';

export default function Game({ supabaseClient }) {
  return (
    <div className='grid place-content-center place-items-center h-screen gap-20 justify-center place-self-center relative'>
      <div className='absolute top-10 right-10'>
        <input
          type='checkbox'
          value='light'
          className='toggle theme-controller'
        />
      </div>
      <div className='grid w-min gap-5'>
        <h1 className='separated roboto-regular text-2xl uppercase  text-center'>
          Buttons
        </h1>
        <Button className='btn-primary text-white'>primary</Button>
        <Button className='btn-secondary'>secondary</Button>
      </div>

      <div className='grid w-min gap-5'>
        <h1 className='separated roboto-regular text-2xl uppercase  text-center'>
          Input fields
        </h1>
        <InputField />
        <InputField>
          <Globe className='text-secondary' />
        </InputField>
        <div className='flex'>
          <InputField vertical={true} className='w-[100px]'>
            <Hash className='text-secondary' />
          </InputField>
        </div>
      </div>
    </div>
  );
}
