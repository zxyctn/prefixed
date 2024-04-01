import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, User } from 'react-feather';
import { SupabaseClient } from '@supabase/supabase-js';
import { useNavigate, useOutletContext } from 'react-router-dom';

import InputField from '../components/InputField';
import Button from '../components/Button';

const ForgotPassword = () => {
  const supabase: SupabaseClient = useOutletContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://example.com/update-password',
    });
    if (error) {
      console.error(error);
      toast.error(error.message);
    } else {
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
          <User className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10' />
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
    </div>
  );
};

export default ForgotPassword;
