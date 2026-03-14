import { ClerkProvider as ClerkProviderOriginal } from '@clerk/clerk-react';
import React from 'react';

const FALLBACK_PUBLISHABLE_KEY = 'pk_test_ZW5oYW5jZWQtaGFyZS02NS5jbGVyay5hY2NvdW50cy5kZXYk';

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const publishableKey =
    (import.meta as any)?.env?.VITE_CLERK_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY;

  return (
    <ClerkProviderOriginal publishableKey={publishableKey} afterSignOutUrl="/">
      {children}
    </ClerkProviderOriginal>
  );
};