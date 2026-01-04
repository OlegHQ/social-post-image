'use client';

import { SessionProvider } from 'next-auth/react';
import { DesignProvider } from '@/context/DesignContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DesignProvider>
        {children}
      </DesignProvider>
    </SessionProvider>
  );
}
