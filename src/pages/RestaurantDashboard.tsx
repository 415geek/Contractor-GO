// ... existing imports ...
import { TestSetup } from '@/test-setup';

const RestaurantDashboard = () => {
  // ... existing code ...

  return (
    <AppLayout title="Restaurant OS" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-6">
        <TestSetup />
        {/* ... rest of the dashboard content ... */}
      </div>
      <AIManager />
    </AppLayout>
  );
};

export default RestaurantDashboard;