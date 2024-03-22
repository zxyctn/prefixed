import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Globe, Hash, Users } from 'react-feather';
import { SupabaseClient } from '@supabase/supabase-js';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentUser, isLoading } from '../stores';
import Separated from '../components/Separated';

const Home = () => {
  const supabase: SupabaseClient = useOutletContext();
  const navigate = useNavigate();
  const setLoading = useSetRecoilState(isLoading);
  const player = useRecoilValue(currentUser);

  const [games, setGames] = useState<any>([]);

  const handleJoin = async (game) => {
    setLoading(true);
    const { data, error } = await supabase.rpc('join_game', {
      p_unique_id: game.unique_id,
    });

    if (error) {
      console.error('Error joining game: ', error);
      toast.error(`Error joining game: ${error.message}`);
      setLoading(false);
      return;
    } else if (data.length > 0) {
      console.log('Joined game', data);
      toast.success('Joined game');
      navigate(`/prefixed/game/${game.id}`);
    } else {
      console.error('Error joining game');
      toast.error('Error joining game');
    }
    setLoading(false);
  };

  useEffect(() => {
    const getGames = async () => {
      setLoading(true);
      // TODO: Filter games that don't have maximum number of players reached
      const { data, error } = await supabase
        .from('game')
        .select()
        .eq('state', 'not_started');

      // not_started means the game is still open for joining
      // not_ready means the game is full and ready to start
      // in_progress means the game is currently being played

      const gamesData = await Promise.all(
        data!.map(async (game) => {
          const { data: gamePlayersData, error } = await supabase
            .from('game_players')
            .select('game_id')
            .eq('game_id', game.id);

          return {
            id: game.id,
            lang: game.lang,
            prefix: game.prefix,
            number_of_players: game.number_of_players,
            joined_players: gamePlayersData?.length,
          };
        })
      );

      setGames(gamesData);
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
        filter: 'state=eq.not_started',
      },
      (payload) => {
        console.log('Game created', payload);
      }
    )
    .subscribe();

  // TODO: When clicked on row open up modal for joining the game
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
