import { atom } from 'recoil';
import type { Session, User } from '@supabase/supabase-js';

import type { GameType } from './types';

export const currentGame = atom<GameType | null>({
  key: 'currentGame',
  default: null,
});

export const currentSession = atom<Session | null>({
  key: 'currentSession',
  default: undefined,
});

export const currentUser = atom<User | null>({
  key: 'currentUser',
  default: null,
});

export const isLoading = atom<boolean>({
  key: 'isLoading',
  default: false,
});

export const currentGameState = atom<{ state: string; id: number }>({
  key: 'currentGameState',
  default: {
    state: 'not_started',
    id: -1,
  },
});
