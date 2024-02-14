import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Globe, Hash, Users } from 'react-feather';
import { SupabaseClient } from '@supabase/supabase-js';

const Home = ({ setPage }) => {
  setPage('Home');

  const supabase: SupabaseClient = useOutletContext();
  const [games, setGames] = useState<any>([]);

  const handler = async (data) => {
    console.log('data', data);  
    // const gamesData = await Promise.all(
    //   data!.map(async (game) => {
    //     const { data: gamePlayersData, error } = await supabase
    //       .from('game_players')
    //       .select('game_id')
    //       .eq('game_id', game.id);

    //     return {
    //       id: game.id,
    //       lang: game.lang,
    //       prefix: game.prefix,
    //       number_of_players: game.number_of_players,
    //       joined_players: gamePlayersData?.length,
    //     };
    //   })
    // );
  };

  useEffect(() => {
    const getGames = async () => {
      // TODO: Filter games that don't have maximum number of players reached
      const { data, error } = await supabase
        .from('game')
        .select()
        .eq('state', 'not_started');

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
      handler
    )
    .subscribe();

  // TODO: When clicked on row open up modal for joining the game
  return (
    <div className='overflow-x-auto'>
      <table className='table table-lg table-pin-cols'>
        <thead>
          <tr>
            <th>
              <Globe className='m-auto text-secondary' />
            </th>
            <th>
              <Hash className='m-auto text-secondary' />
            </th>
            <th>
              <Users className='m-auto text-secondary' />
            </th>
          </tr>
        </thead>

        <tbody>
          {games.map((game) => (
            <tr className='uppercase text-center' key={game.id}>
              <th className=''>
                <div className='separated'>{game.lang}</div>
              </th>
              <td className=''>
                <div className='separated'>{game.prefix}</div>
              </td>
              <td className=''>
                <div className='separated'>
                  {game.joined_players}/{game.number_of_players}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
