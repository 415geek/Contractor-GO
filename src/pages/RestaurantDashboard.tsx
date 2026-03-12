"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';
import { TestSetup } from '@/components/TestSetup';
import { MultiAgentSystem } from '@/components/MultiAgentSystem';
import { POSIntegration } from '@/components/POSIntegration';
import CompetitiveAnalysis from '@/components/CompetitiveAnalysis';
import { RealTimeAnalytics } from '@/components/RealTimeAnalytics';
import { InventoryManager } from '@/components/InventoryManager';
import { StaffManager } from '@/components/StaffManager';
import { AIManager } from '@/components/AIManager';

const RestaurantDashboard = () => {
  const navigate = useNavigate();

  const headerRight = (
    <>
      <Button variant="ghost" size="icon" className="text-purple-600">
        Analytics
      </Button>
    </>
  );

  return (
    <AppLayout title="Restaurant OS" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-6">
        <TestSetup />
        <MultiAgentSystem />
        <POSIntegration />
        <CompetitiveAnalysis />
        <RealTimeAnalytics />
        <InventoryManager />
        <StaffManager />
      </div>
      <AIManager />
    </AppLayout>
  );
};

export default RestaurantDashboard;