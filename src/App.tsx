import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Game from './routes/Game';
import Root from './routes/root';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Join from './routes/Join';
import Create from './routes/Create';
import Invites from './routes/Invites';
import Settings from './routes/Settings';
import ForgotPassword from './routes/ForgotPassword';
import NoGame from './routes/NoGame';

const App = () => {
  const [page, setPage] = useState<string>('');

  const router = createBrowserRouter([
    {
      path: '/prefixed',
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
          path: 'forgot-password',
          element: <ForgotPassword />,
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
        {
          path: 'game',
          element: <NoGame />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
