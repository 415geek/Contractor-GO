import { ClerkProvider as ClerkProviderOriginal } from '@clerk/clerk-react';
import React from 'react';

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  // 使用 Clerk 的无密钥模式
  return (
    <ClerkProviderOriginal
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProviderOriginal>
  );
};