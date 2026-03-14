"use client";

import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;