import React from 'react';
import { Globe, Hash, Users } from 'react-feather';

import Button from '../components/Button';
import InputField from '../components/InputField';

const Create = () => {
  return (
    <div className='w-full h-full grid place-items-center place-content-center gap-3 md:gap-6'>
      <div className='flex md:gap-6 gap-4 w-full'>
        <div className='w-[75px] md:w-[100px]'>
          <InputField
            vertical={true}
            className='text-center'
            type='select'
            options={[
              { value: 'az', label: 'AZ' },
              { value: 'en', label: 'EN' },
            ]}
          >
            <Globe />
          </InputField>
        </div>
        <div className='w-[120px] md:w-[200px]'>
          <InputField vertical={true} className='text-center separated-min'>
            <Hash />
          </InputField>
        </div>
        <div className='w-[75px] md:w-[100px]'>
          <InputField
            vertical={true}
            className='text-center'
            type='number'
            min={2}
            max={10}
          >
            <Users />
          </InputField>
        </div>
      </div>
      <Button className='btn-primary w-full'>Create</Button>
      <Button className='btn-secondary w-full'>Advanced</Button>
    </div>
  );
};

export default Create;
