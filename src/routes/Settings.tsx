import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { SupabaseClient } from '@supabase/supabase-js';
import { LogOut, User } from 'react-feather';
import { useOutletContext } from 'react-router-dom';
import { themeChange } from 'theme-change';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Separated from '../components/Separated';
import { currentUser } from '../stores';

const Settings = () => {
  const supabase: SupabaseClient = useOutletContext();
  const setPlayer = useSetRecoilState(currentUser);
  const player = useRecoilValue(currentUser);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      toast.error('Error logging out');
    }

    setPlayer(null);
    toast.success('Logged out');
  };

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className='p-6 flex flex-col gap-4 h-full sm:text-xl md:text-2xl'>
      <h1 className='uppercase separated-min'>Settings</h1>
      <div className='grow align-top gap-3 flex flex-col'>
        <div className='flex justify-between items-center w-full flex-wrap gap-2'>
          <p className='uppercase separated-min'>Theme</p>
          <select
            className='select border-secondary uppercase sm:text-xl md:text-2xl'
            data-choose-theme
          >
            <option value='dark'>Dark</option>
            <option value='light'>Light</option>
            <option value=''>OS Preference</option>
          </select>
        </div>
      </div>

      <div className='dropdown dropdown-top w-full sm:min-w-[300px] sm:w-max'>
        <div tabIndex={0} role='button' className=''>
          <div className='btn btn-secondary flex justify-between items-center w-full flex-wrap gap-2 p-3 py-3 h-full'>
            <User className='w-6 h-6 lg:w-8 lg:h-8' />
            <div className='uppercase font-medium text-xs sm:text-sm lg:text-lg'>{player?.email}</div>
          </div>
        </div>
        <ul tabIndex={0} className='dropdown-content w-full mb-2'>
          <div className='btn btn-secondary flex'>
            <div
              onClick={signOut}
              className='grow uppercase separated-min items-center cursor-pointer align-bottom flex gap-4 text-sm lg:text-lg'
            >
              <LogOut className='w-6 h-6 lg:w-8 lg:h-8' />
              <span className='whitespace-nowrap text-right w-full'>
                Sign out
              </span>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
