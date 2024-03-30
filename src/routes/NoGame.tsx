import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';

import Separated from '../components/Separated';
import { currentGameState } from '../stores';

const NoGame = () => {
  const gameState = useRecoilValue(currentGameState);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameState.state === 'in_progress') {
      navigate(`/prefixed/game/${gameState.id}`);
    }
  }, [gameState]);

  return (
    <div className='flex justify-center w-screen h-screen items-center fixed -z-50'>
      <Separated content='No game in progress' className='separated-min' />
    </div>
  );
};

export default NoGame;
