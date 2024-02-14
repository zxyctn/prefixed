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
      <Home onClick={() => navigate('/')} className={isCurrent('Home')} />
      <LogIn onClick={() => navigate('/join')} className={isCurrent('Join')} />
      <Plus
        onClick={() => navigate('/create')}
        className={isCurrent('Create')}
      />
      <User
        onClick={() => navigate('/invites')}
        className={isCurrent('Invites')}
      />
      <Settings
        onClick={() => navigate('/settings')}
        className={isCurrent('Settings')}
      />
    </div>
  );
};

export default Navigation;
