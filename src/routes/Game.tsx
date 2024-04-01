import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import {
  Clock,
  Globe,
  Hash,
  Info,
  Send,
  Sliders,
  Users,
  X,
} from 'react-feather';
import { SupabaseClient } from '@supabase/supabase-js';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Confirm from '../components/Confirm';
import Turn from '../components/Turn';
import Separated from '../components/Separated';
import Modal from '../components/Modal';
import {
  currentGame,
  currentGameState,
  currentUser,
  isLoading,
} from '../stores';
import { leaveGame } from '../shared';
import type { CurrentTurnType, GameTurnType } from '../types';

const Game = () => {
  const id = useParams<{ id: string }>().id || '';
  const supabase: SupabaseClient = useOutletContext() || null;
  const navigate = useNavigate();

  const player = useRecoilValue(currentUser) || null;
  const setJoinedGameState = useSetRecoilState(currentGameState);
  const setLoading = useSetRecoilState(isLoading);
  const setGameState = useSetRecoilState(currentGameState);
  const [game, setGame] = useRecoilState(currentGame);
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
  const [possibilities, setPossibilities] = useState<number>(0);
  const [expirationTimeout, setExpirationTimeout] = useState<any>(null);
  const [expirationInterval, setExpirationInterval] = useState<any>(null);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [poll, setPoll] = useState<{ id: number; content: string }>();
  const [timer, setTimer] = useState<{ duration: number; startedAt: Date }>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [players, setPlayers] = useState<{
    [key: string]: {
      points: number;
      ready: boolean;
      turn: number;
      is_turn: boolean;
    };
  }>({});

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

  const showModal = (modalId) => {
    (document.getElementById(modalId) as HTMLDialogElement).showModal();
  };

  const hideModal = (modalId) => {
    (document.getElementById(modalId) as HTMLDialogElement).close();
  };

  const onStartPoll = async (vote_type: 'NOT_EXISTS') => {
    resetStates();
    setDisabled({ value: true, message: 'Poll in progress' });
    setLoading(true);
    await supabase.from('game_votes').insert([
      {
        game_id: id,
        content: word,
        vote_type: vote_type,
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

  const onPollResponse = async (vote: 'no' | 'yes') => {
    if (!sent && poll?.content) {
      setSent(true);

      let { data, error } = await supabase.rpc('increment_vote', {
        vote_id: poll?.id,
        vote_type: vote,
      });

      if (error) {
        console.error(error);
        toast.error(error.message);
      } else {
        toast.success(`Voted ${vote}`);
      }

      hideModal('notExistsPoll');
      setPoll(undefined);
      setSent(false);
      setLoading(false);
    }
  };

  const onConfirmLeave = async () => {
    hideModal('leaveGame');
    leaveGame(player?.id, supabase).then(() => {
      setGameState({ state: 'not_started', id: -1 });
      toast.success('Left the game');
      navigate('/prefixed/');
    });
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

  const insertTurn = async () => {
    if (!disabled.value) {
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
    }
  };

  const keystrokeHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      insertTurn();
    } else if (
      (/^[a-zA-Z\-]$/i.test(e.key) && game!.lang === 'en') ||
      (/^[a-zA-ZƏəĞğİiıÖöÜüÇçŞş\-]$/i.test(e.key) && game!.lang === 'az') ||
      e.key === 'Backspace'
    ) {
      // Do nothing
    } else {
      e.preventDefault();
    }
  };

  const toggleIsReady = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('game_players')
      .update({
        ready: !isReady,
      })
      .eq('player_id', player?.id);

    if (error) {
      console.error(error);
      toast.error(error.message);
    } else {
      setLoading(false);
      setIsReady((old) => !old);
    }
  };

  const copyIdToClipboard = async () => {
    navigator.clipboard.writeText(game?.unique_id || '');
    toast.success('Copied to clipboard');
  };

  const showPossibilities = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_word_count', {
      pre: game?.prefix,
      g_id: id,
    });

    if (error) {
      setLoading(false);
      console.error('Error retrieving the word count', error);
      toast.error(`Error retrieving the word count: ${error.message}`);
      return;
    }

    setLoading(false);
    setPossibilities(data);
    showModal('prefix');
  };

  useEffect(() => {
    const init = async () => {
      if (id && supabase && player) {
        setJoinedGameState({ state: 'in_progress', id: parseInt(id) });

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
            setPlayers((old) => ({
              ...old,
              [p.player_id]: {
                points: p.points,
                ready: p.ready,
                turn: p.turn,
                is_turn: p.is_turn,
              },
            }));

            if (p.player_id === player.id) {
              setDisabled({
                value: p.turn !== data.turn,
                message: p.turn !== data.turn ? 'Wait for your turn' : '',
              });

              setIsReady(p.ready);

              setTurn({
                value: p.turn,
                startedAt:
                  p.turn === data.turn && p.timer_started_at
                    ? new Date(p.timer_started_at)
                    : null,
                endsAt:
                  p.turn === data.turn && p.timer_will_end_at
                    ? new Date(p.timer_will_end_at)
                    : null,
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
        } else {
          console.error('Game was not found');
          toast(
            'Game was not found.\n\nYou will be redirected to the home page.',
            {
              icon: '🏠',
              duration: 5000,
            }
          );

          setTimeout(() => {
            navigate('/prefixed/');
          }, 5000);
        }

        if (error) {
          console.error(error);
          toast.error(error.message);
        }
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
      setTurn((old) => ({
        value: old?.value || -1,
        startedAt: null,
        endsAt: null,
        ended: false,
      }));
      setLoading(false);
    };

    if (subscribed && turn && turn.startedAt && turn.endsAt && !turn.ended) {
      const interval = setInterval(() => {
        setTurn((old) => {
          if (old && old.startedAt) {
            const diff = new Date().getTime() - old.startedAt.getTime();
            const duration = game!.turn_duration! * 1000;

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
      console.log(turn);
      insertEmptyAfterTimeout();
    }

    return () => {
      // Clear the timeout or interval here
      clearTimeout(expirationTimeout);
      clearInterval(expirationInterval);
    };
  }, [turn, subscribed]);

  useEffect(() => {
    if (turn !== null && !subscribed) {
      supabase
        .channel(`game=${id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game_players',
            filter: `game_id=eq.${game?.id}`,
          },
          (payload) => {
            setPlayers((old) => ({
              ...old,
              [payload.new.player_id]: {
                points: payload.new.points,
                ready: payload.new.ready,
                turn: payload.new.turn,
                is_turn: payload.new.is_turn,
              },
            }));

            if (
              payload.new.is_turn === true &&
              payload.new.player_id === player?.id
            ) {
              setTurn((old) => ({
                value: old?.value || 0,
                startedAt: payload.new.timer_started_at
                  ? new Date(payload.new.timer_started_at)
                  : null,
                endsAt: payload.new.timer_will_end_at
                  ? new Date(payload.new.timer_will_end_at)
                  : null,
                ended: false,
              }));
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'game_players',
            filter: `game_id=eq.${game?.id}`,
          },
          (payload) => {
            setPlayers((old) => ({
              ...old,
              [payload.new.player_id]: {
                points: payload.new.points,
                ready: payload.new.ready,
                turn: payload.new.turn,
                is_turn: payload.new.is_turn,
              },
            }));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'game_turns',
            filter: `game_id=eq.${id}`,
          },
          (payload) => {
            console.log(payload);

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
            if (payload.new.joined_players < game!.joined_players) {
              const { data, error } = await supabase
                .from('game_players')
                .select('player_id')
                .eq('game_id', id);

              if (error) {
                console.error(error);
                toast.error(error.message);
              }

              if (data && payload.new.joined_players < game!.joined_players) {
                Object.keys(players).forEach((p) => {
                  if (
                    !data.some((d) => d.player_id === p) &&
                    p !== player?.id
                  ) {
                    toast('A player left the game', {
                      icon: '👋',
                    });
                  }
                });
              }
            }
            setDisabled({
              value: payload.new.turn !== turn?.value,
              message:
                payload.new.turn !== turn?.value ? 'Wait for your turn' : '',
            });
            setGame((old) => ({
              ...old!,
              state: payload.new.state,
              joined_players: payload.new.joined_players,
            }));

            if (payload.new.turn !== turn?.value) {
              resetStates();
            }
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
              if (payload.new.vote_type === 'NOT_EXISTS') {
                setPoll({
                  content: payload.new.content,
                  id: payload.new.id,
                });
                setTimer({ duration: 30, startedAt: new Date() });
                showModal('notExistsPoll');
              }
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
            if (payload.new.vote_type === 'NOT_EXISTS') {
              setLoading(true);
              const { error } = await supabase.rpc('notexists_voting_handler', {
                param_id: payload.new.id,
              });
              setLoading(false);
              if (error) {
                console.error(error);
                toast.error(error.message);
              }
              resetStates();
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'player_colors',
            filter: `game_id=eq.${id}`,
          },
          async (payload) => {
            if (player?.id !== payload.new.player_id) {
              const { data, error } = await supabase
                .from('colors')
                .select('hex')
                .eq('id', payload.new.color_id);

              if (error) {
                console.error(`Error retrieving color for the user: ${error}`);
                toast.error(
                  `Error retrieving color for the user: ${error.message}`
                );
                return;
              }

              setAvatars((old) => ({
                ...old,
                [payload.new.player_id]: data[0].hex,
              }));
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') setSubscribed(true);
        });
    }

    return () => {
      // Clear the timeout or interval here
      clearTimeout(expirationTimeout);
      clearInterval(expirationInterval);
      supabase.channel(`game=${id}`).unsubscribe();
    };
  }, [turn]);

  return (
    <div className='h-full w-full p-4 sm:px-6 md:px-8 flex flex-col'>
      {game && (
        <div className='flex justify-between pb-4 sm:pb-6 items-center'>
          <span>
            <button
              onClick={() => showModal('gameConfig')}
              className='flex items-center'
            >
              {game?.creator_id === player?.id ? (
                <Sliders className='w-6 h-6 md:w-8 md:h-8' />
              ) : (
                <Info className='w-6 h-6 md:w-8 md:h-8' />
              )}
            </button>
          </span>
          <span className='uppercase flex justify-center w-full'>
            <button onClick={showPossibilities}>
              <Separated content={game?.prefix} className='separated-min' />
            </button>
          </span>
          <button onClick={() => showModal('leaveGame')}>
            <X className='w-6 h-6 md:w-8 md:h-8' />
          </button>
        </div>
      )}

      <div className='grow flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6'>
        <AnimatePresence>
          {game?.state === 'in_progress' &&
            turns.map((turn) => (
              <Turn
                turn={turn}
                color={avatars[turn?.player_id] || 'fff'}
                key={turn.created_at}
                points={players[turn.player_id]?.points}
              />
            ))}

          {game?.state === 'not_ready' &&
            players &&
            Object.keys(players)
              .filter((p) => p !== player?.id)
              .map((p) => (
                <Turn
                  turn={players[p].ready ? 'Ready' : 'Not ready'}
                  color={avatars[p] || 'fff'}
                  key={`state-${p}`}
                />
              ))}

          {game?.state === 'not_started' &&
            Object.keys(players)
              .filter((p) => p !== player?.id)
              .map((p) => (
                <Turn
                  turn='Joined'
                  color={avatars[p] || 'fff'}
                  key={`state-${p}`}
                />
              ))}
        </AnimatePresence>
      </div>

      <div className='fixed bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-32 flex w-full flex-col right-0 px-4 sm:px-6 md:px-8'>
        {game?.state === 'not_ready' ? (
          <button
            onClick={toggleIsReady}
            className={`btn uppercase ${
              isReady ? 'btn-secondary' : 'btn-primary'
            }`}
          >
            <Separated
              content={`Ready${!isReady ? '?' : ''}`}
              className='separated-min'
            />
          </button>
        ) : game?.state === 'in_progress' ? (
          <div>
            {disabled.value && (
              <span
                className='uppercase separated-min bg-primary p-2 text-xs flex w-full'
                key={disabled.value ? 1 : 0}
              >
                {disabled.message}
              </span>
            )}
            <div className='grid gap-0 relative'>
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
                      background: player ? avatars[player.id] : '#fff',
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
                    onClick={insertTurn}
                    disabled={disabled.value}
                    type='button'
                  >
                    <Send className='w-6 h-6 md:w-8 md:h-8' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={copyIdToClipboard}
            className='btn btn-secondary uppercase'
          >
            <Separated content='Copy ID' className='separated-min' />
          </button>
        )}
      </div>

      <Confirm
        id='startPoll'
        title="Doesn't exist"
        confirmButtonText='Start poll'
        cancelButtonText='Cancel'
        onConfirm={() => onStartPoll('NOT_EXISTS')}
        onCancel={onCancelStartPoll}
      >
        <h1 className='roboto-bold uppercase text-center text-md lg:text-lg'>
          <Separated content={word} />
        </h1>
      </Confirm>

      <Confirm
        id='notExistsPoll'
        title='Exists?'
        confirmButtonText='Yes'
        cancelButtonText='No'
        onConfirm={() => onPollResponse('yes')}
        onCancel={() => onPollResponse('no')}
        onTimerFinish={() => onPollResponse('no')}
        duration={timer}
      >
        <h1 className='roboto-bold uppercase text-center text-md lg:text-lg'>
          <Separated content={poll?.content} />
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
        <h1 className='roboto-bold uppercase text-center text-md lg:text-lg'>
          <Separated content='Leave the game?' />
        </h1>
      </Confirm>

      <Modal id='gameConfig' title='specs'>
        <div className='grid gap-3'>
          <div className='border border-secondary'>
            <div className='flex gap-5 w-min p-3 sm:p-4 lg:p-5 text-lg sm:text-xl md:text-2xl items-center'>
              <Users className='w-6 h-6 md:w-8 md:h-8' />
              {game?.number_of_players}
            </div>
          </div>
          <div className='border border-secondary'>
            <div className='flex gap-5 w-min p-3 sm:p-4 lg:p-5 text-lg sm:text-xl md:text-2xl items-center'>
              <Hash className='w-6 h-6 md:w-8 md:h-8' />
              <Separated content={game?.prefix} />
            </div>
          </div>
          <div className='border border-secondary'>
            <div className='flex gap-5 w-min p-3 sm:p-4 lg:p-5 text-lg sm:text-xl md:text-2xl items-center'>
              <Globe className='w-6 h-6 md:w-8 md:h-8' />
              <span className='uppercase separated-min'>{game?.lang}</span>
            </div>
          </div>
          <div className='border border-secondary'>
            <div className='flex gap-5 w-min p-3 sm:p-4 lg:p-5 text-lg sm:text-xl md:text-2xl items-center'>
              <Clock className='w-6 h-6 md:w-8 md:h-8' />
              {game?.turn_duration}
              <div className='uppercase separated-min'>seconds</div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal id='prefix' title={game?.prefix}>
        <div className='text-center'>
          <Separated
            content={`${possibilities} possible words`}
            className='separated-min'
          />
        </div>
      </Modal>
    </div>
  );
};

export default Game;
