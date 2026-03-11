"use client";

import React from 'react';
import { ClerkProvider as OriginalClerkProvider } from '@clerk/nextjs';

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <OriginalClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#6366F1',
          colorBackground: '#ffffff',
          colorText: '#1F2937',
          colorInputBackground: '#ffffff',
          colorInputText: '#1F2937',
        },
        elements: {
          formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700',
          card: 'shadow-xl rounded-2xl',
          headerTitle: 'text-2xl font-bold text-gray-900',
          headerSubtitle: 'text-gray-600',
        },
      }}
    >
      {children}
    </OriginalClerkProvider>
  );
};