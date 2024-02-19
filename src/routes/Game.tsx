import { SupabaseClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Send } from 'react-feather';
import { useOutletContext, useParams } from 'react-router-dom';

const Game = () => {
  const id = useParams<{ id: string }>().id;
  const supabase: SupabaseClient = useOutletContext();

  const [lang, setLang] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [word, setWord] = useState<string>('');
  const [playerPoints, setPlayerPoints] = useState<number>(0);
  const [player, setPlayer] = useState<string>('');
  const [turns, setTurns] = useState<any[]>([]);
  const [avatar, setAvatar] = useState<string>('#000');

  useEffect(() => {
    supabase
      .from('game')
      .select('*')
      .eq('id', id)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          setPrefix(data[0].prefix);
          setWord(data[0].prefix);
          setLang(data[0].lang);
          setPlayerPoints(0);
          turnsHandler();
        }
      });
  }, [id, supabase]);

  useEffect(() => {
    const setUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setPlayer(data.user.id);

        console.log(data.user.id);

        const { data: colorData, error: colorError } = await supabase
          .from('player_colors')
          .select('color_id')
          .eq('player_id', data.user.id)
          .eq('game_id', id);

        console.log(colorData);

        const { data: avatarData, error: avatarError } = await supabase
          .from('colors')
          .select('*')
          .eq('id', colorData![0].color_id);

        setAvatar(avatarData![0].hex);
      }
    };
    setUser();
  }, [supabase]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value.length > prefix.length &&
      e.target.value.startsWith(prefix)
    ) {
      setWord(e.target.value);
    } else {
      setWord(prefix);
    }
  };

  const turnsHandler = async () => {
    const { data, error } = await supabase
      .from('game_turns')
      .select('*')
      .eq('game_id', id);

    if (error) {
      console.error(error);
    } else {
      setTurns(data.slice(-10));
    }
  };

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
      turnsHandler
    )
    .subscribe();

  const keystrokeHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const { data, error } = await supabase
        .from(lang.toLowerCase())
        .select('*')
        .ilike('word', word);

      if (error) {
        console.error(error);
      } else {
        if (data.length > 0) {
          await supabase
            .from('game_players')
            .update({ points: playerPoints + 1 })
            .eq('player_id', player);
          setPlayerPoints(playerPoints + 1);

          await supabase.from('game_dict').insert({
            word: word,
            pre_1: word.charAt(0),
            pre_2: word.substring(0, 2),
            pre_3: word.substring(0, 3),
            pre_4: word.substring(0, 4),
            lang: lang,
            game: id,
          });

          await supabase.from('game_turns').insert({
            player_id: player,
            word: word,
            game_id: id,
            existent: true,
            repeated: false,
            accepted: true,
          });
        } else {
          console.log('Word does not exist');
        }
      }

      // TODO: Show modal to start a poll for the word's existence
    } else if (
      ((!/^[a-zA-Z]$/i.test(e.key) && lang === 'en') ||
        (!/^[a-zA-ZƏəĞğİiÖöÜüÇçŞş]$/i.test(e.key) && lang === 'az')) &&
      e.key !== 'Backspace'
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className='h-full w-full p-4 flex flex-col'>
      <span className='uppercase separated-min flex justify-center w-full text-lg'>
        {prefix}
      </span>
      <div className='grow'>
        {turns.map((turn) => (
          <div key={turn.word} className='grid gap-2'>
            <div>user: {turn.player_id}</div>
            <div>word: {turn.word}</div>
          </div>
        ))}
      </div>
      <div className='relative bg-neutral flex items-center px-3'>
        <div className='w-3 h-3' style={{ background: avatar }}></div>
        <input
          type='text'
          className='p-3 bg-transparent w-10/12 uppercase separated-min'
          value={word}
          onChange={changeHandler}
          onKeyDown={keystrokeHandler}
        />
        <Send className='absolute right-3 bottom-3' size={20} />
      </div>
    </div>
  );
};

export default Game;
