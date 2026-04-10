import React from 'react';
import type { RouteConfig } from './type';
import { Layout } from '@/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const DashboardV2 = React.lazy(() => import('@/pages/dashboard/DashboardV2'));
const TaskV2 = React.lazy(() => import('@/pages/task/TasksV2'));
const FocusV2 = React.lazy(() => import('@/pages/focus/FocusV2'));
const FocusRoomV2 = React.lazy(() => import('@/pages/focus-room/FocusRoomV2'));
const LoginV2 = React.lazy(() => import('@/pages/LoginV2/LoginV2'));
const RegisterV2 = React.lazy(() => import('@/pages/RegisterV2'));
const ForgotPasswordV2 = React.lazy(() => import('@/pages/ForgotPasswordV2'));
const ResetPasswordV2 = React.lazy(() => import('@/pages/ResetPasswordV2'));
const VerifyEmailV2 = React.lazy(() => import('@/pages/VerifyEmailV2'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

export const routes: RouteConfig[] = [
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
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];
