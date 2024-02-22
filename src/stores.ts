import { atom } from 'recoil';
import type { Session, User } from '@supabase/supabase-js';

import type { GameType } from './types';

export const currentGame = atom<GameType | null>({
  key: 'currentGame',
  default: null,
});

export const gamePlayers = atom<{ id: string }[]>({
  key: 'gamePlayers',
  default: [],
});

export const currentSession = atom<Session | null>({
  key: 'currentSession',
  default: undefined,
});

export const currentUser = atom<User | null>({
  key: 'currentUser',
  default: null,
});
