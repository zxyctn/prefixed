import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Send, Sliders, X } from 'react-feather';
import { SupabaseClient } from '@supabase/supabase-js';
import { useOutletContext, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import Confirm from '../components/Confirm';
import Turn from '../components/Turn';
import { currentGame, currentUser, isLoading } from '../stores';
import type { CurrentTurnType, GameTurnType } from '../types';

const Game = () => {
  const id = useParams<{ id: string }>().id || null;
  const supabase: SupabaseClient = useOutletContext() || null;

  const player = useRecoilValue(currentUser) || null;
  const [game, setGame] = useRecoilState(currentGame);
  const [loading, setLoading] = useRecoilState(isLoading);
  const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
  const [word, setWord] = useState<string>('');
  const [turns, setTurns] = useState<GameTurnType[]>([]);
  const [turn, setTurn] = useState<CurrentTurnType | null>(null);
  const [disabled, setDisabled] = useState<{
    value: boolean;
    message: string;
  }>({
    value: false,
    message: '',
  });
  const [progress, setProgress] = useState<number>(0);
  const [expirationTimeout, setExpirationTimeout] = useState<any>(null);
  const [expirationInterval, setExpirationInterval] = useState<any>(null);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [notExists, setNotExists] = useState<{ id: number; word: string }>();
  const [timer, setTimer] = useState<{ duration: number; startedAt: Date }>();

  const resetStates = () => {
    setWord(game?.prefix || '');
    setProgress(0);
    setTurn((old) => ({
      value: old?.value || -1,
      startedAt: null,
      endsAt: null,
      ended: false,
    }));
    clearTimeout(expirationTimeout);
    clearInterval(expirationInterval);
    setExpirationTimeout(null);
    setExpirationInterval(null);
  };

  const insertEmptyAfterTimeout = async () => {
    setLoading(true);
    await supabase.from('game_turns').insert({
      player_id: player?.id,
      word: '',
      game_id: id,
      existent: false,
      repeated: false,
      accepted: false,
    });
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      if (id && supabase && player) {
        setLoading(true);
        let { data, error } = await supabase.rpc('get_game_info', {
          param_id: id,
        });
        setLoading(false);

        if (data) {
          setGame(data);
          setWord(data.prefix);
          setTurns(data.turns ? [...data.turns].reverse() : []);
          data.players.forEach((p) => {
            if (p.player_id === player.id) {
              setDisabled({
                value: p.turn !== data.turn,
                message: p.turn !== data.turn ? 'Wait for your turn' : '',
              });

              setTurn({
                value: p.turn,
                startedAt:
                  p.turn === data.turn ? new Date(p.timer_started_at) : null,
                endsAt:
                  p.turn === data.turn ? new Date(p.timer_will_end_at) : null,
                ended: false,
              });
            }
          });

          setAvatars(
            data.players.reduce((acc, curr) => {
              acc[curr.player_id] = curr.color;
              return acc;
            }, {} as { [key: string]: string })
          );
        }

        console.error(error);
      }
    };

    init();

    return () => {
      // Clear the timeout or interval here
      clearTimeout(expirationTimeout);
      clearInterval(expirationInterval);
    };
  }, [id, supabase, player]);

  useEffect(() => {
    if (turn && turn?.startedAt && turn.endsAt && !turn.ended) {
      const interval = setInterval(() => {
        setTurn((old) => {
          if (old && old.startedAt) {
            const now = new Date();
            const diff = now.getTime() - old.startedAt.getTime();
            const duration = (game?.turn_duration || 60) * 1000;

            if (now >= turn.endsAt!) {
              return { ...old, startedAt: null, endsAt: null, ended: true };
            }

            // Calculate the progress based on the difference between the current time and the start time
            const progress = (diff / duration) * 100;
            setProgress(progress);
          }
          return old;
        });
      }, 1);

      setExpirationInterval(interval);

      return () => {
        clearInterval(interval);
      };
    } else if (turn && !turn.startedAt && !turn.endsAt && turn.ended) {
      insertEmptyAfterTimeout().then(() => {
        setTurn((old) => ({
          value: old?.value || -1,
          startedAt: null,
          endsAt: null,
          ended: false,
        }));
      });
    }

    return () => {
      // Clear the timeout or interval here
      clearTimeout(expirationTimeout);
      clearInterval(expirationInterval);
    };
  }, [turn]);

  useEffect(() => {
    if (turn !== null && !subscribed) {
      supabase
        .channel(`game=${id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'game_turns',
            filter: `game_id=eq.${id}`,
          },
          async (payload) => {
            // setTimeout(() => {
            setTurns((old) =>
              [
                ...old,
                {
                  accepted: payload.new.accepted,
                  repeated: payload.new.repeated,
                  existent: payload.new.existent,
                  word: payload.new.word,
                  player_id: payload.new.player_id,
                  id: payload.new.id,
                  created_at: payload.new.created_at,
                },
              ].slice(-10)
            );
            // }, 5000);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game',
            filter: `id=eq.${id}`,
          },
          async (payload) => {
            setDisabled({
              value: payload.new.turn !== turn?.value,
              message:
                payload.new.turn !== turn?.value ? 'Wait for your turn' : '',
            });
            resetStates();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'game_votes',
            filter: `game_id=eq.${id}`,
          },
          (payload) => {
            if (payload.new.player_id !== player?.id) {
              setNotExists({
                word: payload.new.content,
                id: payload.new.id,
              });
              setTimer({ duration: 60, startedAt: new Date() });
              showModal('notExistsPoll');
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game_votes',
            filter: `player_id=eq.${player?.id}`,
          },
          async (payload) => {
            setLoading(true);
            const { error } = await supabase.rpc('notexists_voting_handler', {
              param_id: payload.new.id,
            });
            setLoading(false);
            if (error) {
              console.error(error);
            }
            resetStates();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game_players',
            filter: `player_id=eq.${player?.id}`,
          },
          (payload) => {
            resetStates();

            if (payload.new.is_turn === true) {
              setTurn((old) => ({
                value: old?.value || 0,
                startedAt: new Date(payload.new.timer_started_at) || null,
                endsAt: new Date(payload.new.timer_will_end_at) || null,
                ended: false,
              }));
            }
          }
        )
        .subscribe((status, err) => {
          setSubscribed(true);
        });
    }

    return () => {
      // Clear the timeout or interval here
      clearTimeout(expirationTimeout);
      clearInterval(expirationInterval);
    };
  }, [id, player, game, turn]);

  const showModal = (modalId) => {
    (document.getElementById(modalId) as HTMLDialogElement).showModal();
  };

  const hideModal = (modalId) => {
    (document.getElementById(modalId) as HTMLDialogElement).close();
  };

  const onStartPoll = async () => {
    resetStates();
    setDisabled({ value: true, message: 'Poll in progress' });
    setLoading(true);
    await supabase.from('game_votes').insert([
      {
        game_id: id,
        content: word,
        vote_type: 'NOT_EXISTS',
        result: null,
        player_id: player?.id,
        yes: 1,
      },
    ]);
    setLoading(false);
  };

  const onCancelStartPoll = async () => {
    hideModal('startPoll');
  };

  const onConfirmPoll = async () => {
    setLoading(true);
    let { data, error } = await supabase.rpc('increment_vote', {
      vote_id: notExists?.id,
      vote_type: 'yes',
    });
    setLoading(false);
    if (error) console.error(error);

    hideModal('notExistsPoll');
  };

  const onCancelPoll = async () => {
    if (notExists && !sent) {
      setSent(true);

      setLoading(true);
      let { data, error } = await supabase.rpc('increment_vote', {
        vote_id: notExists?.id,
        vote_type: 'no',
      });
      setLoading(false);

      if (error) console.error(error);

      hideModal('notExistsPoll');
      setNotExists(undefined);
      setSent(false);
    }
  };

  const onConfirmLeave = async () => {
    // TODO: Leave the game by deleting user's id from game_players
    hideModal('leaveGame');
  };

  const onCancelLeave = async () => {
    hideModal('leaveGame');
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      game &&
      e.target.value.length > game.prefix.length &&
      e.target.value.startsWith(game.prefix)
    ) {
      setWord(e.target.value);
    } else {
      setWord(game?.prefix || '');
    }
  };

  const keystrokeHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setLoading(true);
      const { data: checkWordData, error: checkWordError } = await supabase.rpc(
        'check_word',
        {
          param_game_id: id,
          param_player_id: player?.id,
          param_word: word,
        }
      );
      setLoading(false);

      const { repeated, existence } = checkWordData;

      if (!existence) {
        showModal('startPoll');
      } else {
        setLoading(true);
        await supabase.rpc('insert_new_turn', {
          g_id: id,
          word: word,
          existent: existence,
          repeated: repeated,
          accepted: existence,
        });
        setLoading(false);
        resetStates();
      }
    } else if (
      (/^[a-zA-Z]$/i.test(e.key) && game!.lang === 'en') ||
      (/^[a-zA-ZƏəĞğİiÖöÜüÇçŞş]$/i.test(e.key) && game!.lang === 'az') ||
      e.key === 'Backspace'
    ) {
      // Do nothing
    } else {
      e.preventDefault();
    }
  };

  return (
    <div className='h-full w-full p-4 flex flex-col'>
      <div className='flex justify-between pb-4 items-center'>
        <span>
          <button>
            <Sliders />
          </button>
        </span>
        <span className='uppercase separated-min flex justify-center w-full text-2xl'>
          {game?.prefix}
        </span>
        <button onClick={() => showModal('leaveGame')}>
          <X />
        </button>
      </div>

      <div className='grow flex flex-col gap-5'>
        <AnimatePresence>
          {turns.map((turn) => (
            <Turn
              turn={turn}
              color={avatars[turn?.player_id] || 'fff'}
              key={turn.created_at}
            />
          ))}
        </AnimatePresence>
      </div>

      {disabled.value && (
        <span
          className='uppercase separated-min bg-primary p-2'
          key={disabled.value ? 1 : 0}
        >
          {disabled.message}
        </span>
      )}
      <div className='grid gap-0'>
        {turn?.startedAt && (
          <progress
            className='progress progress-primary'
            value={progress}
            max={100}
          ></progress>
        )}

        <div
          className={`relative bg-neutral flex items-center px-3 ${
            disabled.value && 'text-gray-500 brightness-50'
          }`}
        >
          <div
            className='w-3 h-3 '
            style={{
              background: player ? avatars[player.id] : '#fff',
            }}
          ></div>

          <input
            type='text'
            className='p-3 bg-transparent w-10/12 uppercase separated-min'
            value={word}
            onChange={changeHandler}
            onKeyDown={keystrokeHandler}
            disabled={disabled.value}
          />
          <Send className='absolute right-3 bottom-3 ' size={20} />
        </div>
      </div>

      <Confirm
        id='startPoll'
        title="Doesn't exist"
        confirmButtonText='Start poll'
        cancelButtonText='Cancel'
        onConfirm={onStartPoll}
        onCancel={onCancelStartPoll}
      >
        <h1 className='separated roboto-bold uppercase text-center text-2xl'>
          {word}
        </h1>
      </Confirm>

      <Confirm
        id='notExistsPoll'
        title='Exists?'
        confirmButtonText='Yes'
        cancelButtonText='No'
        onConfirm={onConfirmPoll}
        onCancel={onCancelPoll}
        onTimerFinish={onCancelPoll}
        duration={timer}
      >
        <h1 className='separated roboto-bold uppercase text-center text-2xl'>
          {notExists?.word}
        </h1>
      </Confirm>

      <Confirm
        id='leaveGame'
        title='Leave?'
        confirmButtonText='Yes'
        cancelButtonText='No'
        onConfirm={onConfirmLeave}
        onCancel={onCancelLeave}
      >
        <h1 className='separated roboto-bold uppercase text-center text-2xl'>
          Leave the game?
        </h1>
      </Confirm>
    </div>
  );
};

export default Game;
