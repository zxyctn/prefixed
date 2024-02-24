import { SupabaseClient } from '@supabase/supabase-js';

export const getRandomColors = (n: number) => {
  const colors = [
    { name: 'green', hex: '#34eb7d' },
    { name: 'red', hex: '#eb3434' },
    { name: 'yellow', hex: '#f5e322' },
    { name: 'sky', hex: '#34cdeb' },
    { name: 'blue', hex: '#0062ff' },
    { name: 'purple', hex: '#5c18c9' },
    { name: 'pink', hex: '#e66ae6' },
    { name: 'orange', hex: '#e68f32' },
    { name: 'teal', hex: '#2debc5' },
    { name: 'brown', hex: '#825116' },
  ];

  const result: { name: string; hex: string }[] = [];

  for (let i = 0; i < n; i++) {
    result.push(colors[Math.ceil(Math.random() * n)]);
  }

  return result;
};

export const getGame = async (game_id: string, supabase: SupabaseClient) => {
  return await supabase.from('game').select('*').eq('id', game_id);
};

export const getPlayers = (game_id: string, supabase: SupabaseClient) => {
  return supabase
    .from('game_players')
    .select('player_id, order')
    .eq('game_id', game_id);
};

export const getAvatars = (game_id: string, supabase: SupabaseClient) => {
  return supabase
    .from('player_colors')
    .select('player_id, colors (hex)')
    .eq('game_id', game_id);
};

export const getTurns = (game_id: string, supabase: SupabaseClient) => {
  return supabase
    .from('game_turns')
    .select('id, player_id, word')
    .eq('game_id', game_id)
    .order('created_at', { ascending: false })
    .limit(10);
};
