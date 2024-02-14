import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './routes/root';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Join from './routes/Join';
import Create from './routes/Create';
import Invites from './routes/Invites';
import Settings from './routes/Settings';

export default function App() {
  const [page, setPage] = useState<string>('Home');

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root page={page} />,
      errorElement: <div>Error</div>,
      children: [
        {
          path: '',
          element: <Home setPage={setPage} />,
        },
        {
          path: 'login',
          element: <Login setPage={setPage} />,
        },
        {
          path: 'register',
          element: <Register setPage={setPage} />,
        },
        {
          path: 'join',
          element: <Join setPage={setPage} />,
        },
        {
          path: 'create',
          element: <Create setPage={setPage} />,
        },
        {
          path: 'invites',
          element: <Invites setPage={setPage} />,
        },
        {
          path: 'settings',
          element: <Settings setPage={setPage} />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
