'use client';

import { getQueryClient } from '@/api/queryClient';
import { SignInDialog } from '@/app/_sign-in/sign-in-dialog';
import { ConfirmProvider } from '@/app/confirm';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Toaster } from './ui/toaster';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <ConfirmProvider>
            {children}
            <SignInDialog />
          </ConfirmProvider>
        </TooltipProvider>
      </ThemeProvider>
      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
