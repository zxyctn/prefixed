import React, { useState } from 'react';
import { Hash, UserPlus } from 'react-feather';

const Invites = () => {
  const [tab, setTab] = useState('Games');

  return (
    <div>
      <div role='tablist' className='tabs py-4'>
        <a
          role='tab'
          className={`tab ${
            tab === 'Games' ? 'text-secondary' : 'text-neutral'
          }`}
          onClick={() => setTab('Games')}
        >
          <Hash />
        </a>
        <a
          role='tab'
          className={`tab ${
            tab === 'Friends' ? 'text-secondary' : 'text-neutral'
          }`}
          onClick={() => setTab('Friends')}
        >
          <UserPlus />
        </a>
      </div>

      <div>content</div>
    </div>
  );
};

export default Invites;
