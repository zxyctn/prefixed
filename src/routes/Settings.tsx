import React from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { LogOut } from 'react-feather';
import { useOutletContext } from 'react-router-dom';

const Settings = () => {
  const supabase: SupabaseClient = useOutletContext();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <div className='p-6 flex flex-col gap-4 h-full'>
      <h1 className='uppercase separated-min text-2xl'>Settings</h1>
      <div className='grow align-top'>
        <div className='flex justify-between items-center w-full flex-wrap gap-2'>
          <p className='uppercase separated-min'>Theme</p>
          <select
            className='select border-secondary uppercase'
            data-choose-theme
          >
            <option value='dark'>Dark</option>
            <option value='light'>Light</option>
            <option value=''>OS Preference</option>
          </select>
        </div>
      </div>

      <div
        onClick={signOut}
        className='uppercase separated-min items-center cursor-pointer align-bottom flex gap-4 text-sm'
      >
        <LogOut size={20} />
        <span>Sign out</span>
      </div>
    </div>
  );
};

export default Settings;
