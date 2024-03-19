import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { createClient } from '@supabase/supabase-js';
import { themeChange } from 'theme-change';

import Navigation from '../components/Navigation';
import { currentSession, currentUser, isLoading } from '../stores';
import { Toaster } from 'react-hot-toast';

const supabase = createClient(
  `${process.env.VITE_SUPABASE_URL}`,
  `${process.env.VITE_SUPABASE_API_KEY}`
);

const Root = ({ page, setPage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [session, setSession] = useRecoilState(currentSession);
  const [loading, setLoading] = useRecoilState(isLoading);
  const setPlayer = useSetRecoilState(currentUser);

  useEffect(() => {
    themeChange(false);

    setLoading(true);
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setPlayer(session.user);
      } else {
        setPlayer(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (
      session === null &&
      location.pathname !== '/prefixed/register' &&
      location.pathname !== '/prefixed/login' &&
      location.pathname !== '/prefixed/forgot-password'
    ) {
      navigate('/prefixed/login');
    } else if (
      session &&
      (location.pathname === '/prefixed/login' ||
        location.pathname === '/prefixed/register' ||
        location.pathname === '/prefixed/forgot-password')
    ) {
      navigate('/prefixed/');
    }
  }, [session]);

  useEffect(() => {
    setPage(location.pathname);
  }, [location.pathname]);

  return (
    <div className='h-screen flex flex-col'>
      <Toaster />
      {loading && (
        <div className='fixed w-full h-full flex justify-center items-center z-10'>
          <div className='blur absolute'></div>
          <span className='loading loading-spinner loading-lg z-50'></span>
        </div>
      )}
      <div className='grow'>
        <Outlet context={supabase} />
      </div>
      {session && !location.pathname.includes('game') && (
        <div className='align-bottom w-full'>
          <Navigation page={page} />
        </div>
      )}
    </div>
  );
};

export default Root;
