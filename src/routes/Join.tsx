import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Key } from 'react-feather';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';

import InputField from '../components/InputField';
import Button from '../components/Button';

const Join = () => {
  const supabase: SupabaseClient = useOutletContext();
  const [uniqueId, setUniqueId] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.rpc('join_game', {
      p_unique_id: uniqueId,
    });

    if (error) {
      console.error('Error joining game: ', error);
      toast.error(`Error joining game: ${error.message}`);
      return;
    }

    console.log('Joined game', data);
    toast.success('Joined game');
    navigate(`/prefixed/game/${data}`);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUniqueId(e.target.value);
  };

  return (
    <form
      onSubmit={submitHandler}
      className='w-full h-full grid place-items-center place-content-center gap-3 md:gap-6'
    >
      <InputField onChange={changeHandler}>
        <Key />
      </InputField>
      <Button type='submit' className='btn-primary w-full'>
        Join
      </Button>
    </form>
  );
};

export default Join;
