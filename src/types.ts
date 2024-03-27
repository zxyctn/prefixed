import { ReactNode } from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: any;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export type InputFieldProps = {
  children?: ReactNode;
  vertical?: boolean;
  className?: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  value?: string | number;
  onChange?: (e) => void;
  onKeyDown?: (e) => void;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
};

export type ConfirmModalProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
};

export type GameType = {
  created_at: string;
  creator_id: string;
  id: number;
  lang: 'az' | 'en';
  number_of_players: number;
  password: string | null;
  prefix: string;
  state: 'not_started' | 'in_progress' | 'not_ready';
  turn: number | null;
  turn_duration: number | null;
  unique_id: string;
};

export type GamePlayerType = {
  created_at: string;
  id: string;
  points: number;
  turn: number;
  ready: boolean;
  timer_started_at: string;
  timer_will_end_at: string;
  color: string;
};

export type GameTurnType = {
  created_at: string;
  existent: boolean;
  accepted: boolean;
  repeated: boolean;
  word: string;
  player_id: string;
  id: number;
};

export type CurrentTurnType = {
  value: number;
  startedAt: Date | null;
  endsAt: Date | null;
  ended: boolean;
};
