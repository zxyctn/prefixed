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
    <div className='flex justify-between p-6 md:px-14 px-10'>
      <Home
        onClick={() => navigate('/prefixed/')}
        className={isCurrent('/prefixed/')}
      />
      <LogIn
        onClick={() => navigate('/prefixed/join')}
        className={isCurrent('/prefixed/join')}
      />
      <Plus
        onClick={() => navigate('/prefixed/create')}
        className={isCurrent('/prefixed/create')}
      />
      <User
        onClick={() => navigate('/prefixed/invites')}
        className={isCurrent('/prefixed/invites')}
      />
      <Settings
        onClick={() => navigate('/prefixed/settings')}
        className={isCurrent('/prefixed/settings')}
      />
    </div>
  );
};

export default Navigation;
