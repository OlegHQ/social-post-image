'use client';

import { SessionProvider } from 'next-auth/react';
import { DesignProvider } from '@/context/DesignContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <DesignProvider>
          {children}
        </DesignProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
