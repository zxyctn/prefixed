import React from 'react';

import Button from './components/Button';
import InputField from './components/InputField';
import { Globe, Hash } from 'react-feather';
import Modal from './components/Modal';
import Confirm from './components/Confirm';

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
        <Button className='btn-primary'>primary</Button>
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

      <div className='grid gap-5'>
        <Button
          className='btn-primary'
          onClick={() =>
            (
              document.getElementById('my_modal_3') as HTMLDialogElement
            ).showModal()
          }
        >
          Open Modal
        </Button>
        <Modal id='my_modal_3'>Test</Modal>
      </div>

      <div className='grid gap-5'>
        <Button
          className='btn-primary'
          onClick={() =>
            (
              document.getElementById('my_confirm_3') as HTMLDialogElement
            ).showModal()
          }
        >
          Open Confirm
        </Button>
        <Confirm
          id='my_confirm_3'
          title='EXISTS?'
          confirmButtonText='Yes'
          cancelButtonText='No'
        >
          <h1 className='separated roboto-bold uppercase text-center text-2xl'>
            MƏYYUS
          </h1>
        </Confirm>
      </div>
    </div>
  );
}
