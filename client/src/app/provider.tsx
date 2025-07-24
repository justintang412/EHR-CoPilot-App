import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '../components/errors/Main';
import { Notifications } from '@/components/ui/notifications';
import { queryConfig } from '@/lib/react-query';
import { CircularProgress } from '@mui/material';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );
  return (
    <React.Suspense
      fallback={
        <CircularProgress color="success" />
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          {import.meta.env.DEV && <ReactQueryDevtools />}
          <Notifications />
          {children}
          
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
