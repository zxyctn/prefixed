import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Home, LogIn, Plus, Settings } from 'react-feather';
import { useRecoilValue } from 'recoil';
import { currentGameState } from '../stores';
import Separated from './Separated';

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
    <div className='flex justify-between p-6 md:px-14'>
      <Home
        onClick={() => navigate('/prefixed/')}
        className={isCurrent('/prefixed/')}
      />
      <LogIn
        onClick={() => navigate('/prefixed/join')}
        className={isCurrent('/prefixed/join')}
      />
      <Hash
        onClick={() =>
          navigate(
            `/prefixed/game${
              gameState.state === 'in_progress' ? `/${gameState.id}` : ''
            }`
          )
        }
        className={isCurrent(
          `/prefixed/game${
            gameState.state === 'in_progress' ? `/${gameState.id}` : ''
          }`
        )}
      />
      <Plus
        onClick={() => navigate('/prefixed/create')}
        className={isCurrent('/prefixed/create')}
      />
      <Settings
        onClick={() => navigate('/prefixed/settings')}
        className={isCurrent('/prefixed/settings')}
      />
    </div>
  );
};

export default Navigation;
