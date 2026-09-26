import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { WorkspaceLayout } from './workspace-layout';
import { workspaces } from './workspaces';
import { PageLoading } from './loading';
import { AccessDeniedPage, NotFoundPage } from '../pages/status-pages';

const WorkspacePage = lazy(() => import('../pages/workspace-page'));
const FoundationPage = lazy(() => import('../pages/foundation-page'));
const workspaceContent = <Suspense fallback={<PageLoading />}><WorkspacePage /></Suspense>;
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dispatcher" replace /> },
  ...workspaces.map((workspace) => ({ path: `/${workspace.id}`, element: <WorkspaceLayout workspace={workspace} />, children: workspace.navigation.map((item) => item.path ? { path: item.path, element: workspaceContent } : { index: true, element: workspaceContent }) })),
  { path: '/foundation', element: <Suspense fallback={<PageLoading />}><FoundationPage /></Suspense> },
  { path: '/access-denied', element: <AccessDeniedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
