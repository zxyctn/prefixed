import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './routes/root';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Join from './routes/Join';
import Create from './routes/Create';
import Invites from './routes/Invites';
import Settings from './routes/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
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
    ],
  },
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
