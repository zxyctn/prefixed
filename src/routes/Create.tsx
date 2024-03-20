import React, { useState } from 'react';
import { Globe, Hash, Users } from 'react-feather';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';

import Button from '../components/Button';
import InputField from '../components/InputField';
import { useRecoilValue } from 'recoil';
import { currentUser } from '../stores';
import toast from 'react-hot-toast';

const Create = () => {
  const supabase: SupabaseClient = useOutletContext();
  const player = useRecoilValue(currentUser);
  const navigate = useNavigate();

  const [lang, setLang] = useState('az');
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [prefix, setPrefix] = useState('');
  const [turnDuration, setTurnDuration] = useState(60);

  const submitHandler = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.rpc('create_game', {
      p_prefix: prefix,
      p_number_of_players: numberOfPlayers,
      p_lang: lang,
      p_turn_duration: turnDuration,
    });

    if (error) {
      console.error('Error creating game', error);
      toast.error(`Error creating game: ${error.message}`);
      return;
    } else {
      console.log('Created game', data);
      toast.success('Created game');
      navigate(`/prefixed/game/${data}`);
    }
  };

  const prefixChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrefix(e.target.value);
  };

  const langChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
  };

  const numberOfPlayersChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfPlayers(parseInt(e.target.value));
  };

  return (
    <form
      onSubmit={submitHandler}
      className='w-full h-full grid place-items-center place-content-center gap-3 md:gap-6'
    >
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
            onChange={langChangeHandler}
          >
            <Globe />
          </InputField>
        </div>
        <div className='w-[120px] md:w-[200px]'>
          <InputField
            vertical={true}
            className='text-center separated-min'
            onChange={prefixChangeHandler}
          >
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
            onChange={numberOfPlayersChangeHandler}
          >
            <Users />
          </InputField>
        </div>
      </div>
      <Button type='submit' className='btn-primary w-full'>
        Create
      </Button>
      <Button type='button' className='btn-secondary w-full'>
        Advanced
      </Button>
    </form>
  );
};

export default Create;
