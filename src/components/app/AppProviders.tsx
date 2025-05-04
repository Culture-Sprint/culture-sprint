
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import OfflineSupport from './OfflineSupport';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Application providers wrapper component
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      {/* Initialize offline support */}
      <OfflineSupport />
      
      {/* Render children */}
      {children}
      
      {/* Global UI components */}
      <Toaster />
    </ThemeProvider>
  );
}

export default AppProviders;
