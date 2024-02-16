import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { themeChange } from 'theme-change';

import Game from './routes/Game';
import Root from './routes/root';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Join from './routes/Join';
import Create from './routes/Create';
import Invites from './routes/Invites';
import Settings from './routes/Settings';

const App = () => {
  const [page, setPage] = useState<string>('');

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root page={page} setPage={setPage} />,
      errorElement: <div>Error</div>,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
        {
          path: 'join',
          element: <Join />,
        },
        {
          path: 'create',
          element: <Create />,
        },
        {
          path: 'invites',
          element: <Invites />,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
        {
          path: 'game/:id',
          element: <Game />,
        },
      ],
    },
  ]);

  useEffect(() => {
    themeChange(false);
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
