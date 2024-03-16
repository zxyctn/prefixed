import React, { useState } from 'react';
import { ArrowLeft, User } from 'react-feather';
import { SupabaseClient } from '@supabase/supabase-js';
import { useNavigate, useOutletContext } from 'react-router-dom';

import InputField from '../components/InputField';
import Button from '../components/Button';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const supabase: SupabaseClient = useOutletContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://example.com/update-password',
    });
    if (error) {
      (
        document.getElementById('resetPasswordModal') as HTMLDialogElement
      ).showModal();
      setMessage(error.message);
      console.error(error);
      toast.error(error.message);
    } else {
      setMessage('Password reset email sent');
      console.log(data);
      toast.success('Password reset email sent');
    }
  };

  const changeHandler = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className='w-full h-full p-6 m-auto flex justify-center items-center'>
      <form className='grid gap-6 ' onSubmit={submitHandler}>
        <InputField type='email' required={true} onChange={changeHandler}>
          <User />
        </InputField>

        <Button className='btn-primary' type='submit'>
          Submit
        </Button>

        <button className='fixed top-8 left-8 flex gap-5 items-center'>
          <ArrowLeft />
          <span
            onClick={() => navigate('/prefixed/login')}
            className='separated uppercase font-medium'
          >
            Back
          </span>
        </button>
      </form>
      <Modal id='resetPasswordModal'>
        <span className='separated-min uppercase'>{message}</span>
      </Modal>
    </div>
  );
};

export default ForgotPassword;
