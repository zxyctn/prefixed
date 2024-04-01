import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Clock, Globe, Hash, Key, Users } from 'react-feather';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';

import Button from '../components/Button';
import InputField from '../components/InputField';
import Modal from '../components/Modal';

const Create = () => {
  const supabase: SupabaseClient = useOutletContext();
  const navigate = useNavigate();

  const [lang, setLang] = useState('az');
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [prefix, setPrefix] = useState('');
  const [turnDuration, setTurnDuration] = useState(60);
  const [password, setPassword] = useState('');

  const showAdvanced = () => {
    (document.getElementById('advanced') as HTMLDialogElement).showModal();
  };

  const turnDurationHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTurnDuration(parseInt(e.target.value));
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.rpc('create_game', {
      p_prefix: prefix,
      p_number_of_players: numberOfPlayers,
      p_lang: lang,
      p_turn_duration: turnDuration,
      p_password: password,
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

  const prefixChangeHandler = (e) => {
    setPrefix(e.target.value);
  };

  const prefixKeystrokeHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Backspace' ||
      (prefix.length <= 3 &&
        ((/^[a-zA-Z]$/i.test(e.key) && lang === 'en') ||
          (/^[a-zA-ZƏəĞğİiıÖöÜüÇçŞş]$/i.test(e.key) && lang === 'az')))
    ) {
    } else {
      e.preventDefault();
    }
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
            value={lang}
            onChange={langChangeHandler}
            required
          >
            <Globe className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10' />
          </InputField>
        </div>
        <div className='w-[120px] md:w-[200px]'>
          <InputField
            vertical={true}
            className='text-center separated-min'
            onKeyDown={prefixKeystrokeHandler}
            onChange={prefixChangeHandler}
            value={prefix}
            required
          >
            <Hash className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10' />
          </InputField>
        </div>
        <div className='w-[75px] md:w-[100px]'>
          <InputField
            vertical={true}
            className='text-center'
            type='number'
            min={2}
            max={10}
            value={numberOfPlayers}
            onChange={numberOfPlayersChangeHandler}
            required
          >
            <Users className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10' />
          </InputField>
        </div>
      </div>
      <Button type='submit' className='btn-primary w-full'>
        Create
      </Button>
      <Button
        type='button'
        className='btn-secondary w-full'
        onClick={showAdvanced}
      >
        Advanced
      </Button>

      <Modal id='advanced' title='Advanced'>
        <div className='flex md:gap-6 gap-4 w-full'>
          <InputField
            vertical={true}
            className='text-center'
            type='number'
            min={5}
            max={120}
            onChange={turnDurationHandler}
            value={turnDuration}
            required
          >
            <Clock className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10' />
          </InputField>

          <InputField
            vertical={true}
            className='text-center normal-case'
            onChange={passwordHandler}
            value={password}
          >
            <Key className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10' />
          </InputField>
        </div>
      </Modal>
    </form>
  );
};

export default Create;
