import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Globe, Hash, Users } from 'react-feather';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSetRecoilState } from 'recoil';

import Separated from '../components/Separated';
import { isLoading } from '../stores';

const Home = () => {
  const supabase: SupabaseClient = useOutletContext();
  const navigate = useNavigate();
  const setLoading = useSetRecoilState(isLoading);

  const [games, setGames] = useState<any>([]);

  const handleJoin = async (game) => {
    setLoading(true);
    const { data, error } = await supabase.rpc('join_game', {
      p_unique_id: game.unique_id,
      p_password: '',
    });

    if (error) {
      console.error('Error joining game: ', error);
      toast.error(`Error joining game: ${error.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    console.log('Joined game', data);
    toast.success('Joined game');
    navigate(`/prefixed/game/${game.id}`);
  };

  useEffect(() => {
    const getGames = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('game')
        .select('*')
        .eq('state', 'not_started')
        .eq('password', '');

      if (error) {
        console.error('Error fethcing games', error);
        toast.error(`Error fetching games: ${error.message}`);
        return;
      }

      setGames(
        data?.map((game) => ({
          id: game.id,
          lang: game.lang,
          prefix: game.prefix,
          number_of_players: game.number_of_players,
          joined_players: game.joined_players,
          unique_id: game.unique_id,
        }))
      );

      setLoading(false);
    };

    getGames();
  }, []);

  supabase
    .channel('game')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game',
        filter: 'password=eq.',
      },
      (payload) => {
        if (payload.new.state !== 'not_started') return;

        setGames((prev) => [
          ...prev,
          {
            id: payload.new.id,
            lang: payload.new.lang,
            prefix: payload.new.prefix,
            number_of_players: payload.new.number_of_players,
            joined_players: payload.new.joined_players,
            unique_id: payload.new.unique_id,
          },
        ]);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'game',
        filter: 'state=eq.not_started',
      },
      (payload) => {
        setGames((prev) => prev.filter((game) => game.id !== payload.old.id));
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'game',
        filter: 'state=eq.not_started',
      },
      (payload) => {
        setGames((prev) =>
          prev.map((game) => {
            if (game.id === payload.new.id) {
              return {
                ...game,
                lang: payload.new.lang,
                prefix: payload.new.prefix,
                number_of_players: payload.new.number_of_players,
                joined_players: payload.new.joined_players,
              };
            }

            return game;
          })
        );
      }
    )
    .subscribe();

  return (
    <div className='overflow-x-auto no-scrollbar'>
      <table className='table table-lg table-pin-cols m-auto'>
        <thead className=''>
          <tr>
            <th className='w-1/3'>
              <Globe className='m-auto text-secondary' />
            </th>
            <th className='w-1/3'>
              <Hash className='m-auto text-secondary' />
            </th>
            <th className='w-1/3'>
              <Users className='m-auto text-secondary' />
            </th>
          </tr>
        </thead>

        <tbody className='no-scrollbar'>
          {games &&
            games.map((game) => (
              <tr
                className='uppercase text-center cursor-pointer'
                key={game.id}
                onClick={() => handleJoin(game)}
              >
                <th className=''>
                  <Separated content={game.lang} />
                </th>
                <td className=''>
                  <Separated content={game.prefix} />
                </td>
                <td className=''>
                  <Separated
                    content={`${game.joined_players}/${game.number_of_players}`}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
