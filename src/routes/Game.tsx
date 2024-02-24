import React, { useEffect, useState } from 'react';
import { Send } from 'react-feather';
import { SupabaseClient } from '@supabase/supabase-js';
import { useOutletContext, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { currentGame, currentUser, gamePlayers } from '../stores';
import { getAvatars, getGame, getPlayers, getTurns } from '../shared';

const Game = () => {
  const id = useParams<{ id: string }>().id;
  const supabase: SupabaseClient = useOutletContext();

  const [game, setGame] = useRecoilState(currentGame);
  const player = useRecoilValue(currentUser);
  const [players, setPlayers] = useRecoilState(gamePlayers);
  const [avatars, setAvatars] = useState<{ [key: string]: string }>({});

  const [word, setWord] = useState<string>('');
  const [playerPoints, setPlayerPoints] = useState<number>(0);
  const [turns, setTurns] = useState<any[]>([]);
  const [order, setOrder] = useState<number>();
  const [isTurn, setIsTurn] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getGame(id, supabase).then(({ data, error }) => {
        setGame(data[0]);
        setWord(data[0].prefix);
      });

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
          (payload) => {
            setTurns((old) =>
              [
                ...old,
                {
                  word: payload.new.word,
                  player_id: payload.new.player_id,
                  id: payload.new.id,
                },
              ].slice(-10)
            );
          }
        )
        .subscribe();

      supabase
        .channel(`game_order=${id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game',
            filter: `id=eq.${id}`,
          },
          (payload) => {
            setIsTurn(payload.new.turn === order);
          }
        )
        .subscribe();
    }
  }, [id, supabase]);

  useEffect(() => {
    if (id !== undefined && game !== null && player !== null) {
      getPlayers(id, supabase).then(({ data, error }) => {
        setPlayers(
          data
            ? data.map((p) => {
                if (p.player_id === player!.id) {
                  setOrder(p.order);
                  setIsTurn(p.order === game?.turn);
                }
                return {
                  id: p.player_id,
                };
              })
            : []
        );
      });

      getTurns(id, supabase).then(({ data, error }) => {
        setTurns(data?.reverse() || []);
      });
    }
  }, [id, supabase, game, player, setGame]);

  useEffect(() => {
    if (id && players) {
      getAvatars(id, supabase).then(({ data, error }) => {
        data?.forEach((player) => {
          avatars[player.player_id] = player.colors.hex;
        });
      });
    }
  }, [id, supabase, players]);

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
      supabase
        .from(game!.lang.toLowerCase())
        .select('*')
        .ilike('word', word)
        .then(({ data, error }) => {
          supabase
            .from('game_players')
            .update({ points: playerPoints + 1 })
            .eq('player_id', player?.id)
            .then(() => {
              setPlayerPoints(playerPoints + 1);
              supabase
                .from('game_dict')
                .insert({
                  word: word,
                  pre_1: word.charAt(0),
                  pre_2: word.substring(0, 2),
                  pre_3: word.substring(0, 3),
                  pre_4: word.substring(0, 4),
                  lang: game!.lang,
                  game: id,
                })
                .then(() => {
                  supabase
                    .from('game_turns')
                    .insert({
                      player_id: player?.id,
                      word: word,
                      game_id: id,
                      existent: true,
                      repeated: false,
                      accepted: true,
                    })
                    .then(({ data, error }) => {
                      setWord(game?.prefix || '');
                    });
                });
            });
        });

      // TODO: Show modal to start a poll for the word's existence
    } else if (
      ((!/^[a-zA-Z]$/i.test(e.key) && game!.lang === 'en') ||
        (!/^[a-zA-ZƏəĞğİiÖöÜüÇçŞş]$/i.test(e.key) && game!.lang === 'az')) &&
      e.key !== 'Backspace'
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className='h-full w-full p-4 flex flex-col'>
      <span className='uppercase separated-min flex justify-center w-full text-2xl pb-4'>
        {game?.prefix}
      </span>
      <div className='grow flex flex-col gap-5'>
        {turns &&
          turns.map((turn) => (
            <div key={turn.id} className='flex gap-3 items-center'>
              <div
                className='w-3 h-3'
                style={{
                  background: avatars[turn.player_id] || '#fff',
                }}
              ></div>
              <div className='separated uppercase text-2xl'>{turn.word}</div>
            </div>
          ))}
      </div>
      {!isTurn && (
        <span className='uppercase separated-min bg-primary p-2'>
          wait for your turn
        </span>
      )}

      <div
        className={`relative bg-neutral flex items-center px-3 ${
          !isTurn && 'text-gray-500 brightness-50'
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
          disabled={!isTurn}
        />
        <Send className='absolute right-3 bottom-3 ' size={20} />
      </div>
    </div>
  );
};

export default Game;
