import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider, Toaster } from '@waypoint/ui';
import '@fontsource-variable/inter';
import './styles.css';
import './reference-design.css';
import { ErrorBoundary } from './app/error-boundary';
import { queryClient } from './app/query-client';
import { router } from './app/router';

const root = document.getElementById('root');
if (!root) throw new Error('Application root element is missing');
createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
