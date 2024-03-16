import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, Key } from 'react-feather';
import type { SupabaseClient } from '@supabase/supabase-js';

import InputField from '../components/InputField';
import Button from '../components/Button';

const Register = () => {
  const supabase: SupabaseClient = useOutletContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error(error);
    }
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
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

        <InputField
          type='password'
          required={true}
          onChange={onRepeatPasswordChange}
        >
          <Key />
        </InputField>

        <Button className='btn-primary' type='submit'>
          Register
        </Button>
        <Button
          className='btn-secondary'
          onClick={() => {
            navigate('/prefixed/login');
          }}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Register;
