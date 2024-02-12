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
  type?: string;
  required?: boolean;
  onChange?: (e) => void;
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
