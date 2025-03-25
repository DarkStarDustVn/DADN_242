import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import LoginPage from './components/pages/LoginPage.jsx';
import ErrorPage from './components/pages/errorPage.jsx';
import RegisterPage from './components/pages/RegisterPage.jsx';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage.jsx';
import Dashboard from './components/pages/Dashboard.jsx';
import HomePage from './components/pages/HomePage.jsx';
import DevicesPage from './components/pages/DevicesPage.jsx';
import UsagePage from './components/pages/UsagePage.jsx';
import ProfilePage from './components/pages/ProfilePage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard',
        element: <HomePage />,
      },
      {
        path: 'devices',
        element: <DevicesPage />,
      },
      {
        path: 'usage',
        element: <UsagePage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      }
    ]
  }
])

function App() {
  return (
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
  );
}

export default App;
