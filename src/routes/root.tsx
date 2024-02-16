import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

import Navigation from '../components/Navigation';

const supabase = createClient(
  `${process.env.VITE_SUPABASE_URL}`,
  `${process.env.VITE_SUPABASE_API_KEY}`
);

const Root = ({ page, setPage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      navigate('/login');
    } else if (
      location.pathname === '/login' ||
      location.pathname === '/register'
    ) {
      navigate('/');
    }
  }, [session]);

  useEffect(() => {
    setPage(location.pathname);
  }, [location.pathname]);

  return (
    <div className='h-screen flex flex-col'>
      <div className='grow'>
        <Outlet context={supabase} />
      </div>
      {session && (
        <div className='align-bottom w-full'>
          <Navigation page={page} />
        </div>
      )}
    </div>
  );
};

export default Root;
