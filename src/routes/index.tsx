import React from 'react';
import { Layout } from '@/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { type RouteObject } from 'react-router-dom';

const DashboardV2 = React.lazy(() => import('@/pages/DashboardV2/DashboardV2'));
const TaskV2 = React.lazy(() => import('@/pages/TaskV2/TasksV2'));
const FocusV2 = React.lazy(() => import('@/pages/FocusV2/FocusV2'));
const FocusRoomV2 = React.lazy(() => import('@/pages/FocusRoomV2/FocusRoomV2'));
const LoginV2 = React.lazy(() => import('@/pages/LoginV2/LoginV2'));
const RegisterV2 = React.lazy(() => import('@/pages/RegisterV2'));
const ForgotPasswordV2 = React.lazy(() => import('@/pages/ForgotPasswordV2'));
const ResetPasswordV2 = React.lazy(() => import('@/pages/ResetPasswordV2'));
const VerifyEmailV2 = React.lazy(() => import('@/pages/VerifyEmailV2'));
const ProfileV2 = React.lazy(() => import('@/pages/ProfileV2'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

export const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      { path: 'login', element: <LoginV2 /> },
      { path: 'signup', element: <RegisterV2 /> },
      { path: 'forgot-password', element: <ForgotPasswordV2 /> },
      { path: 'reset-password', element: <ResetPasswordV2 /> },
      { path: 'verify-email', element: <VerifyEmailV2 /> },
      { path: 'focus-room/:roomId', element: <FocusRoomV2 /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              { index: true, element: <DashboardV2 /> },
              { path: 'dashboard', element: <DashboardV2 /> },
              { path: 'tasks', element: <TaskV2 /> },
              { path: 'focus', element: <FocusV2 /> },
              { path: 'profile', element: <ProfileV2 /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];
