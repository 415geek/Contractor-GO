"use client";

import React from 'react';

export const TestSetup = () => {
  return (
    <div className="p-4 bg-unicorn-gradient rounded-lg text-white">
      <h2 className="text-xl font-bold">✅ Restaurant OS Setup Complete</h2>
      <p className="mt-2">Clerk authentication, unicorn-themed UI, and AI manager are ready!</p>
      <div className="mt-4 space-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
          <span>Authentication configured</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
          <span>Unicorn theme applied</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
          <span>AI Manager component ready</span>
        </div>
      </div>
    </div>
  );
};