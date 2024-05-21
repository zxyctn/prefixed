import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Globe, Hash, ArrowLeft, X, Send } from 'react-feather';
import type { SupabaseClient } from '@supabase/supabase-js';

import Button from '../components/Button';
import InputField from '../components/InputField';
import Separated from '../components/Separated';
import Confirm from '../components/Confirm';
import Turn from '../components/Turn';
import { isLoading } from '../stores';
import { showModal, hideModal } from '../shared';
import type { CurrentTurnType, GameTurnType } from '../types';

const Demo = () => {
  const supabase: SupabaseClient = useOutletContext();
  const navigate = useNavigate();

  const setLoading = useSetRecoilState(isLoading);
  const [lang, setLang] = useState('en');
  const [prefix, setPrefix] = useState('st');
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [word, setWord] = useState<string>(prefix || '');
  const [turn, setTurn] = useState<CurrentTurnType | null>(null);
  const [turns, setTurns] = useState<GameTurnType[]>([]);
  const [gameDict, setGameDict] = useState<string[]>([]);
  const [points, setPoints] = useState<{
    pc: number;
    player: number;
  }>({ pc: 0, player: 0 });
  const [disabled, setDisabled] = useState<{
    value: boolean;
    message: string;
  }>({
    value: true,
    message: 'Wait for your turn',
  });
  const [expirationTimeout, setExpirationTimeout] = useState<any>(null);
  const [expirationInterval, setExpirationInterval] = useState<any>(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    setStarted(true);
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

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value.length > prefix.length &&
      e.target.value.startsWith(prefix)
    ) {
      setWord(e.target.value);
    } else {
      setWord(prefix || '');
    }
  };

  const resetStates = () => {
    setWord(prefix || '');
    setProgress(0);
    setTurn({
      value: 1,
      startedAt: null,
      endsAt: null,
      ended: false,
    });
    clearTimeout(expirationTimeout);
    clearInterval(expirationInterval);
    setExpirationTimeout(null);
    setExpirationInterval(null);
  };

  const isRepeated = (word: string) => {
    return gameDict.some((w) => w.toLowerCase() === word.toLowerCase());
  };

  const insertNewTurn = (word: string, player: 'pc' | 'player') => {
    const createdAt = new Date();
    const repeated = word.length > 0 ? isRepeated(word) : false;
    setTurns((old) => {
      return [
        ...old,
        {
          player_id: player,
          word: word,
          created_at: createdAt.toISOString(),
          existent: word.length === 0 ? false : true,
          repeated: repeated,
          accepted: word.length === 0 ? false : true,
          id: +createdAt,
        },
      ];
    });
    if (!repeated) {
      gameDict.push(word);
    }
    setDisabled({ value: true, message: 'Wait for your turn' });

    setPoints((old) => {
      return {
        ...old,
        [player]: old[player] + (!repeated && word.length > 0 ? 1 : 0),
      };
    });

    resetStates();
  };

  const checkInsert = async () => {
    if (!disabled.value) {
      setLoading(true);
      const { data: exists, error } = await supabase.rpc('check_word_demo', {
        lang: lang,
        param_word: word,
      });
      setLoading(false);

      if (!exists) {
        toast.error('Word does not exist');
        console.error(error);
      } else {
        insertNewTurn(word, 'player');
      }
    }
  };

  const keystrokeHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkInsert();
    } else if (
      (/^[a-zA-Z\-]$/i.test(e.key) && lang === 'en') ||
      (/^[a-zA-ZƏəĞğİiıÖöÜüÇçŞş\-]$/i.test(e.key) && lang === 'az') ||
      e.key === 'Backspace'
    ) {
      // Do nothing
    } else {
      e.preventDefault();
    }
  };

  const getRandomWord = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_random_word', {
      lang: lang,
      param_prefix: prefix,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
    } else {
      insertNewTurn(data, 'pc');
    }
  };

  useEffect(() => {
    const insertPCTurn = async () => {
      setTimeout(async () => {
        setLoading(true);
        await getRandomWord();
        setLoading(false);
        setDisabled({ value: false, message: '' });
        setTurn((old) => ({
          value: old?.value || -1,
          startedAt: new Date(),
          endsAt: new Date(new Date().getTime() + 60 * 1000),
          ended: false,
        }));
      }, 1000);
    };

    if (started && disabled.value) {
      insertPCTurn();
    }
  }, [started, disabled]);

  useEffect(() => {
    const insertEmptyAfterTimeout = async () => {
      setTurn((old) => ({
        value: old?.value || -1,
        startedAt: null,
        endsAt: null,
        ended: false,
      }));
      insertNewTurn('', 'player');
    };

    if (turn && turn.startedAt && turn.endsAt && !turn.ended) {
      const interval = setInterval(() => {
        setTurn((old) => {
          if (old && old.startedAt) {
            const diff = new Date().getTime() - old.startedAt.getTime();
            const duration = 60 * 1000;

            if (turn.endsAt && new Date() >= turn.endsAt) {
              return { ...old, startedAt: null, endsAt: null, ended: true };
            }

            // Calculate the progress based on the difference between the current time and the start time
            const progress = (diff / duration) * 100;
            setProgress(progress);
          }
          return old;
        });
      }, 1000);

      setExpirationInterval(interval);

      return () => {
        clearInterval(interval);
      };
    } else if (turn && !turn.startedAt && !turn.endsAt && turn.ended) {
      insertEmptyAfterTimeout();
    } else if (!disabled.value) {
      setDisabled({ value: true, message: 'Wait for your turn' });
    }

    return () => {
      // Clear the timeout or interval here
      clearTimeout(expirationTimeout);
      clearInterval(expirationInterval);
    };
  }, [turn]);

  return (
    <div className='w-full h-full pb-4'>
      {!started ? (
        <form
          onSubmit={submitHandler}
          className='w-full h-full grid place-items-center place-content-center gap-3 md:gap-6'
        >
          <button className='fixed top-8 left-8 flex gap-5 items-center'>
            <ArrowLeft />
            <span
              onClick={() => navigate('/prefixed/login')}
              className='separated uppercase font-medium'
            >
              Back
            </span>
          </button>
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
          </div>
          <Button type='submit' className='btn-primary w-full'>
            Create
          </Button>
        </form>
      ) : (
        <div className='h-full min-h-full w-full pt-4 px-4 sm:px-6 md:px-8 flex flex-col'>
          <div className='flex justify-between items-center mb-4'>
            <span></span>
            <span className='uppercase flex justify-center w-full'>
              <Separated content={prefix} className='separated-min' />
            </span>
            <button onClick={() => showModal('leaveGame')}>
              <X className='w-6 h-6 md:w-8 md:h-8' />
            </button>
          </div>

          <div className='grow h-0 overflow-auto pb-4'>
            <div className='flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full h-auto'>
              <AnimatePresence>
                {turns.slice(-10).map((turn) => (
                  <Turn
                    turn={turn}
                    color={turn.player_id === 'player' ? '#2debc5' : '#5c18c9'}
                    key={turn.created_at}
                    points={points[turn.player_id as 'pc' | 'player']}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className='grid w-full'>
            <div className='place-self-end w-full'>
              <div>
                <div className='grid gap-0 relative'>
                  {disabled.value && (
                    <span
                      className='uppercase separated-min bg-primary p-2 text-xs flex w-full'
                      key={disabled.value ? 1 : 0}
                    >
                      {disabled.message}
                    </span>
                  )}
                  {turn?.startedAt && (
                    <div className='bg-neutral/50'>
                      <div
                        className='transition-all duration-1000 ease-linear bg-primary h-2 '
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                  <div className=''>
                    <div
                      className={`relative bg-neutral flex items-center px-3 sm:px-4 md:px-5 ${
                        disabled.value && 'text-gray-500 brightness-50'
                      }`}
                    >
                      <div
                        className='w-3 h-3 md:w-4 md:h-4'
                        style={{
                          background: '#2debc5',
                        }}
                      ></div>

                      <input
                        type='text'
                        className='p-3 sm:p-4 md:p-5 bg-transparent w-10/12 uppercase separated-min sm:text-xl md:text-2xl'
                        value={word}
                        onChange={changeHandler}
                        onKeyDown={keystrokeHandler}
                        disabled={disabled.value}
                      />
                      <button
                        className={`absolute right-3 bottom-3 sm:right-4 sm:bottom-4 md:right-5 md:bottom-5  ${
                          disabled.value ? ' btn-disabled' : ''
                        }`}
                        onClick={checkInsert}
                        disabled={disabled.value}
                        type='button'
                      >
                        <Send className='w-6 h-6 md:w-8 md:h-8' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Confirm
            id='leaveGame'
            title='Leave?'
            confirmButtonText='Yes'
            cancelButtonText='No'
            onConfirm={() => navigate('/prefixed/login')}
            onCancel={() => hideModal('leaveGame')}
          >
            <h1 className='roboto-bold uppercase text-center text-md lg:text-lg'>
              <Separated content='Leave the game?' />
            </h1>
          </Confirm>
        </div>
      )}
    </div>
  );
};

export default Demo;
