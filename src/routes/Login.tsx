import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, Key } from 'react-feather';
import type { SupabaseClient } from '@supabase/supabase-js';

import InputField from '../components/InputField';
import Button from '../components/Button';

const Login = () => {
  const supabase: SupabaseClient = useOutletContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error(`Error logging in: ${error.message}`);
      toast.error(`Error logging in: ${error.message}`);
    } else {
      toast.success('Logged in successfully');
    }
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className='w-full h-full p-6 m-auto flex justify-center items-center'>
      <form className='grid gap-6 ' onSubmit={submitHandler}>
        <InputField type='email' required={true} onChange={onEmailChange}>
          <User />
        </InputField>

        <InputField type='password' required={true} onChange={onPasswordChange}>
          <Key />
        </InputField>

        <Button className='btn-primary' type='submit'>
          Login
        </Button>
        <Button
          className='btn-secondary'
          onClick={() => {
            navigate('/prefixed/register');
          }}
        >
          Register
        </Button>

        <button
          type='button'
          onClick={() => navigate('/prefixed/forgot-password')}
          className='uppercase font-medium'
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
};

export default Login;
