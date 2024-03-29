import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { createClient } from '@supabase/supabase-js';
import { themeChange } from 'theme-change';

import Navigation from '../components/Navigation';
import {
  currentSession,
  currentUser,
  currentGameState,
  isLoading,
} from '../stores';
import toast, { Toaster } from 'react-hot-toast';
import Separated from '../components/Separated';
import Button from '../components/Button';
import { leaveGame } from '../shared';

const supabase = createClient(
  `${process.env.VITE_SUPABASE_URL}`,
  `${process.env.VITE_SUPABASE_API_KEY}`
);

const Root = ({ page, setPage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [session, setSession] = useRecoilState(currentSession);
  const [loading, setLoading] = useRecoilState(isLoading);
  const [player, setPlayer] = useRecoilState(currentUser);
  const [gameState, setGameState] = useRecoilState(currentGameState);

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

  useEffect(() => {
    if (session && player) {
      supabase
        .from('game_players')
        .select('game_id')
        .eq('player_id', player.id)
        .then(({ data }) => {
          if (data && data.length) {
            setGameState({ state: 'in_progress', id: data[0].game_id });
          }
        });
    }
  }, [player]);

  return (
    <div className='h-screen flex flex-col'>
      <Toaster />
      {session &&
        player &&
        gameState.state !== 'not_started' &&
        page !== `/prefixed/game/${gameState.id}` && (
          <div className='w-full'>
            <div className='bg-neutral text-center p-1 text-xs'>
              <Separated
                className='separated-min'
                content={'game in progress'}
              />
            </div>

            <div className='flex w-full'>
              <button
                className='btn uppercase separated-min btn-primary grow'
                onClick={() => navigate(`/prefixed/game/${gameState.id}`)}
              >
                Join
              </button>
              <button
                className='btn uppercase separated-min btn-secondary grow'
                onClick={() => {
                  leaveGame(player.id, supabase)
                    .then(() => {
                      toast.success('Left game');
                      setGameState({ state: 'not_started', id: -1 });
                    })
                    .catch((error) => {
                      toast.error('Error leaving game');
                      console.error('Error leaving game:', error.message);
                    });
                }}
              >
                Leave
              </button>
            </div>
          </div>
        )}

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
