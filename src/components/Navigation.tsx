import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Home, LogIn, Plus, Settings } from 'react-feather';
import { useRecoilValue } from 'recoil';
import { currentGameState } from '../stores';

const Navigation = ({ page }: { page: string }) => {
  const navigate = useNavigate();
  const gameState = useRecoilValue(currentGameState);

  const isCurrent = (pageName) => {
    return `hover:cursor-pointer ${
      gameState.state === 'in_progress' &&
      pageName === `/prefixed/game/${gameState.id}` &&
      page !== pageName
        ? 'text-primary animate-pulse'
        : page === pageName
        ? 'text-secondary'
        : 'text-neutral'
    }`;
  };

  return (
    <div className='flex justify-between p-6 sm:p-8 lg:p-10 md:px-14 lg:px-20 items-center'>
      <Home
        onClick={() => navigate('/prefixed/')}
        className={
          isCurrent('/prefixed/') + ' w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10'
        }
      />
      <Plus
        onClick={() => navigate('/prefixed/create')}
        className={
          isCurrent('/prefixed/create') +
          ' w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10'
        }
      />
      <Hash
        onClick={() =>
          navigate(
            `/prefixed/game${
              gameState.state === 'in_progress' ? `/${gameState.id}` : ''
            }`
          )
        }
        className={
          isCurrent(
            `/prefixed/game${
              gameState.state === 'in_progress' ? `/${gameState.id}` : ''
            }`
          ) + ' w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10'
        }
      />
      <LogIn
        onClick={() => navigate('/prefixed/join')}
        className={
          isCurrent('/prefixed/join') + ' w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10'
        }
      />
      <Settings
        onClick={() => navigate('/prefixed/settings')}
        className={
          isCurrent('/prefixed/settings') +
          ' w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10'
        }
      />
    </div>
  );
};

export default Navigation;
