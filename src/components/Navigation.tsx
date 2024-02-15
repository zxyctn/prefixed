import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogIn, Plus, Settings, User } from 'react-feather';

const Navigation = ({ page }) => {
  const navigate = useNavigate();

  const isCurrent = (pageName) => {
    return `hover:cursor-pointer ${
      page === pageName ? 'text-secondary' : 'text-neutral'
    }`;
  };

  return (
    <div className='flex justify-between p-8 md:px-14 px-10'>
      <Home onClick={() => navigate('/')} className={isCurrent('/')} />
      <LogIn onClick={() => navigate('/join')} className={isCurrent('/join')} />
      <Plus
        onClick={() => navigate('/create')}
        className={isCurrent('/create')}
      />
      <User
        onClick={() => navigate('/invites')}
        className={isCurrent('/invites')}
      />
      <Settings
        onClick={() => navigate('/settings')}
        className={isCurrent('/settings')}
      />
    </div>
  );
};

export default Navigation;
