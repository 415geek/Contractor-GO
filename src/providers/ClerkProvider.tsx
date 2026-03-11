"use client";

import React from 'react';

// Temporary simplified provider - we'll use Clerk's built-in provider
export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};