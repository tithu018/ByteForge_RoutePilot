import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { WorkspaceLayout } from './workspace-layout';
import { workspaces } from './workspaces';
import { PageLoading } from './loading';
import { AccessDeniedPage, NotFoundPage } from '../pages/status-pages';
import { LoginPage, ProtectedRoute } from '../pages/login-page';

const WorkspacePage = lazy(() => import('../pages/workspace-page'));
const FoundationPage = lazy(() => import('../pages/foundation-page'));
const StoreOrdersPage = lazy(() =>
  import('../pages/store-orders-page').then((module) => ({ default: module.StoreOrdersPage })),
);
const StoreCreateOrderPage = lazy(() =>
  import('../pages/store-orders-page').then((module) => ({ default: module.StoreCreateOrderPage })),
);
const StoreOrderDetailPage = lazy(() =>
  import('../pages/store-orders-page').then((module) => ({ default: module.StoreOrderDetailPage })),
);
const workspaceContent = (
  <Suspense fallback={<PageLoading />}>
    <WorkspacePage />
  </Suspense>
);
const storeOrders = (
  <Suspense fallback={<PageLoading />}>
    <StoreOrdersPage />
  </Suspense>
);
const storeCreate = (
  <Suspense fallback={<PageLoading />}>
    <StoreCreateOrderPage />
  </Suspense>
);
const storeDetail = (
  <Suspense fallback={<PageLoading />}>
    <StoreOrderDetailPage />
  </Suspense>
);
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dispatcher" replace /> },
  { path: '/login', element: <LoginPage /> },
  ...workspaces.map((workspace) => ({
    path: `/${workspace.id}`,
    element: (
      <ProtectedRoute>
        <WorkspaceLayout workspace={workspace} />
      </ProtectedRoute>
    ),
    children:
      workspace.id === 'store'
        ? [
            { index: true, element: workspaceContent },
            { path: 'orders', element: storeOrders },
            { path: 'orders/:id', element: storeDetail },
            { path: 'create', element: storeCreate },
            { path: 'issues', element: workspaceContent },
          ]
        : workspace.navigation.map((item) =>
            item.path
              ? { path: item.path, element: workspaceContent }
              : { index: true, element: workspaceContent },
          ),
  })),
  {
    path: '/foundation',
    element: (
      <Suspense fallback={<PageLoading />}>
        <FoundationPage />
      </Suspense>
    ),
  },
  { path: '/access-denied', element: <AccessDeniedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
