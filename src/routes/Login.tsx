import React, { useState } from 'react';
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
            navigate('/register');
          }}
        >
          Register
        </Button>

        <button
          type='button'
          onClick={() => navigate('/forgot-password')}
          className='uppercase separated-min md:separated font-medium'
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
};

export default Login;
